import { useEffect, useRef, useState } from "react";
import * as vi from "blockly/msg/vi";
import * as Blockly from "blockly";

import "blockly/blocks";
import "@/blockly";

import Sidebar from "./Sidebar";
import { buildFlyout } from "./buildFlyout";
import { CATEGORIES } from "./categories";
import { makeCodeTheme } from "./makeCodeTheme";
import { EMPTY_TOOLBOX } from "./emptyToolbox";

import { pythonGenerator } from "blockly/python";
import { Button } from "@/components/ui/button";

import { uploader } from "@/service/UploadService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  createProject,
  updateProject,
  loadProject,
  getProjects,
  getActiveProjectId,
} from "@/blockly/projects";
import { ChartNoAxesGantt, Code, Pause, Play, Save } from "lucide-react";

export default function BlocklyEditor() {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const activeCategoryRef = useRef<string | null>(null);

  const [projects, setProjects] = useState(getProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [openProjects, setOpenProjects] = useState(false);

  // helper: safe workspace getter
  const getWorkspaceSafe = (): Blockly.WorkspaceSvg | null => {
    if (!workspaceRef.current) {
      console.warn("Workspace not ready");
      return null;
    }
    return workspaceRef.current;
  };

  // ===== FLYOUT UTILS =====
  const getFlyout = (workspace: Blockly.WorkspaceSvg) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspace.getFlyout() as any;

  const hideFlyout = (workspace: Blockly.WorkspaceSvg) => {
    const flyout = getFlyout(workspace);
    if (!flyout) return;

    if (flyout.svgGroup_) {
      try {
        (flyout.svgGroup_ as SVGElement).style.display = "none";
      } catch {
        /* ignore */
      }
    }
    try {
      flyout.scrollbar_?.setVisible(false);
    } catch {
      /* ignore */
    }
    Blockly.svgResize(workspace);
  };

  const showFlyout = (workspace: Blockly.WorkspaceSvg) => {
    const flyout = getFlyout(workspace);
    
    if (!flyout) return;

    if (flyout.svgGroup_) {
      try {
        (flyout.svgGroup_ as SVGElement).style.display = "block";
      } catch {
        /* ignore */
      }
    }
    try {
      flyout.scrollbar_?.setVisible(false);
    } catch {
      /* ignore */
    }
    Blockly.svgResize(workspace);
  };

  // ===== UPDATE FLYOUT =====
  const updateFlyout = (
    toolbox: Blockly.utils.toolbox.ToolboxDefinition,
    show: boolean
  ) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    workspace.updateToolbox(toolbox);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    show ? showFlyout(workspace) : hideFlyout(workspace);
  };

  // ===== CLOSE CATEGORY =====
  const closeCategory = () => {
    if (activeCategoryRef.current === null) return;

    activeCategoryRef.current = null;
    setActiveCategory(null);

    const workspace = workspaceRef.current;
    if (!workspace) return;

    updateFlyout(EMPTY_TOOLBOX, false);
  };

  // ===== DEFAULT BLOCKS =====
  const createDefaultStart = (workspace: Blockly.WorkspaceSvg) => {
    if (workspace.getAllBlocks(false).some((b) => b.type === "on_start"))
      return;
    const block = workspace.newBlock("on_start");
    block.initSvg();
    block.render();
    block.moveBy(20, 200);
  };

  const createDefaultForever = (workspace: Blockly.WorkspaceSvg) => {
    if (workspace.getAllBlocks(false).some((b) => b.type === "forever")) return;
    const block = workspace.newBlock("forever");
    block.initSvg();
    block.render();
    block.moveBy(300, 200);
  };

  // ===== INIT WORKSPACE =====
  useEffect(() => {
    if (!blocklyDiv.current) return;
    if (workspaceRef.current) return;

    Blockly.setLocale(vi as unknown as Record<string, string>);

    const workspace = Blockly.inject(blocklyDiv.current, {
      // renderer: "custom_renderer",
      theme: makeCodeTheme,
      trashcan: true,
      toolbox: EMPTY_TOOLBOX,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      zoom: {
        controls: true,
        wheel: true,
      },
    });

    const activeId = getActiveProjectId();
    if (activeId) {
      try {
        loadProject(activeId, workspace);
        setActiveProjectId(activeId);
      } catch (err) {
        console.error("Failed to load active project", err);
        // don't block init, continue with default workspace
      }
    }

    workspaceRef.current = workspace;

    // ========================================
    // FLYOUT CLICK / DRAG HANDLER
    // ========================================

    let pointerDownOnFlyoutBlock = false;
    let pointerMoved = false;
    let startX = 0;
    let startY = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let clickedFlyoutBlock: Blockly.BlockSvg | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      if (activeCategoryRef.current === null) return;

      const target = e.target as Element;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flyout = workspace.getFlyout() as any;

      if (!flyout?.svgGroup_?.contains(target)) return;

      const flyoutBlockElement = target.closest(
        ".blocklyBlockCanvas .blocklyDraggable"
      );

      if (!flyoutBlockElement) return;

      // ⭐ Lấy block Blockly tương ứng với SVG element
      clickedFlyoutBlock = null;

      const flyoutWorkspace = flyout.getWorkspace();

      if (flyoutWorkspace) {
        const blocks = flyoutWorkspace.getAllBlocks(false);

        clickedFlyoutBlock =
          blocks.find((block: Blockly.BlockSvg) => {
            return block.getSvgRoot()?.contains(flyoutBlockElement);
          }) || null;
      }

      pointerDownOnFlyoutBlock = true;
      pointerMoved = false;

      startX = e.clientX;
      startY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!pointerDownOnFlyoutBlock) return;

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);

      // Di chuyển > 5px => coi là DRAG
      if (dx > 5 || dy > 5) {
        pointerMoved = true;
      }
    };

    const handlePointerUp = () => {
      if (!pointerDownOnFlyoutBlock) return;

      const wasClick = !pointerMoved;

      pointerDownOnFlyoutBlock = false;
      pointerMoved = false;

      // Kéo block → Blockly xử lý như bình thường
      if (!wasClick) {
        clickedFlyoutBlock = null;
        return;
      }

      // ==============================
      // CLICK BLOCK
      // ==============================

      if (!clickedFlyoutBlock) {
        return;
      }

      const flyoutBlock = clickedFlyoutBlock;
      clickedFlyoutBlock = null;

      try {
        const state = Blockly.serialization.blocks.save(flyoutBlock);

        if (!state) {
          console.error("Không thể lưu trạng thái block từ flyout.");
          return;
        }

        const newBlock = Blockly.serialization.blocks.append(
          state,
          workspace
        );

        newBlock.moveBy(100, 100);

        setTimeout(() => {
          closeCategory();
        }, 50);

      } catch (err) {
        console.error("Không thể tạo block từ flyout:", err);
      }
    };

    // ========================================
    // CLICK VÀO WORKSPACE
    // ========================================

    const handleWorkspacePointerDown = (e: PointerEvent) => {
      if (activeCategoryRef.current === null) return;

      const target = e.target as Element;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flyout = workspace.getFlyout() as any;

      // Nếu click trong flyout thì không xử lý
      if (flyout?.svgGroup_?.contains(target)) {
        return;
      }

      // Nếu click sidebar/toolbox thì không xử lý
      if (target.closest(".blocklyToolboxDiv")) {
        return;
      }

      const workspaceSvg = workspace.getParentSvg();

      // Click vào workspace
      if (workspaceSvg.contains(target)) {
        closeCategory();
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
      true
    );

    document.addEventListener(
      "pointermove",
      handlePointerMove,
      true
    );

    document.addEventListener(
      "pointerup",
      handlePointerUp,
      true
    );

    document.addEventListener(
      "pointerup",
      handleWorkspacePointerDown,
      true
    );

    // save on change (debounce could be added if needed)
    workspace.addChangeListener((e) => {
      if (e.isUiEvent) return;
      const activeId = activeProjectId;
      if (!activeId) return;

      // ensure workspace still exists
      if (!workspaceRef.current) return;
      updateProject(activeId, workspaceRef.current);
      // update local state snapshot
      setProjects(getProjects());
    });

    // 🔥 VARIABLES AUTO-REFRESH
    workspace.addChangeListener((e) => {
      if (activeCategoryRef.current !== "variables") return;

      if (
        e.type === Blockly.Events.VAR_CREATE ||
        e.type === Blockly.Events.VAR_DELETE ||
        e.type === Blockly.Events.VAR_RENAME
      ) {
        const contents = Blockly.Variables.flyoutCategory(workspace, false);

        updateFlyout(
          {
            kind: "flyoutToolbox",
            contents,
          },
          true
        );
      }
    });

    // use ref to avoid stale closure for activeCategory
    workspace.addChangeListener((e) => {
      if (!workspaceRef.current) return;
      if (activeCategoryRef.current !== "functions") return;

      if (
        e.type === Blockly.Events.BLOCK_CREATE ||
        e.type === Blockly.Events.BLOCK_DELETE ||
        e.type === Blockly.Events.BLOCK_CHANGE
      ) {
        const contents = Blockly.Procedures.flyoutCategory(workspace, false);

        updateFlyout(
          {
            kind: "flyoutToolbox",
            contents,
          },
          true
        );
      }
    });

    hideFlyout(workspace);
    createDefaultStart(workspace);
    createDefaultForever(workspace);

    // sync projects across tabs
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === "blockly_projects" || e.key === "blockly_active_project") {
        setProjects(getProjects());
        setActiveProjectId(getActiveProjectId());
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);

      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        true
      );

      document.removeEventListener(
        "pointermove",
        handlePointerMove,
        true
      );

      document.removeEventListener(
        "pointerup",
        handlePointerUp,
        true
      );

      document.removeEventListener(
        "pointerup",
        handleWorkspacePointerDown,
        true
      );

      workspace.dispose();
      workspaceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== CATEGORY HANDLER =====
  const setActive = (id: string | null) => {
    activeCategoryRef.current = id;
    setActiveCategory(id);
  };

  const handleSelectCategory = (id: string) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    // toggle off
    if (activeCategoryRef.current === id) {
      setActive(null);
      updateFlyout(EMPTY_TOOLBOX, false);
      return;
    }

    setActive(id);

    // ⭐ VARIABLES
    if (id === "variables") {
      const contents = Blockly.Variables.flyoutCategory(workspace, false);

      updateFlyout(
        {
          kind: "flyoutToolbox",
          contents,
        },
        true
      );
      return;
    }

    if (id === "functions") {
      const contents = Blockly.Procedures.flyoutCategory(workspace, false);

      updateFlyout(
        {
          kind: "flyoutToolbox",
          contents,
        },
        true
      );
      return;
    }

    const category = CATEGORIES.find((c) => c.id === id);
    if (!category) return;

    updateFlyout(buildFlyout(category.contents), true);
  };

  function indent(code: string) {
    if (!code.trim()) return "    pass";

    return code
      .split("\n")
      .map(line => line ? "    " + line : "")
      .join("\n");
  }

  // ===== RENDER =====
  return (
    <div
      style={{ display: "flex", height: "calc(100vh - 4rem)", overflow: "hidden" }}
    >
      <Sidebar activeCategory={activeCategory} onSelect={handleSelectCategory} />

      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: 30,
            zIndex: 10,
            padding: 8,
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Button
            onClick={async () => {
              const ws = getWorkspaceSafe();

              if (!ws) {
                alert("Workspace không tồn tại");
                return;
              }

              try {
                const blocks = ws.getTopBlocks(true);

                let beginCode = "";
                let foreverHandler = "";
                let foreverId = "";

                // ========================================
                // LẤY CODE TỪ CÁC TOP BLOCK
                // ========================================

                for (const block of blocks) {
                  // ON START
                  if (block.type === "on_start") {
                    beginCode =
                      pythonGenerator.blockToCode(block) as string;
                  }

                  // FOREVER
                  if (block.type === "forever") {
                    foreverId = block.id;

                    foreverHandler =
                      pythonGenerator.blockToCode(block) as string;
                  }
                }

                // ========================================
                // TẠO TÊN FUNCTION FOREVER
                // ========================================

                const foreverFunctionName =
                  `routine_${foreverId.replace(
                    /[^a-zA-Z0-9_]/g,
                    "_"
                  )}`;

                // ========================================
                // TẠO ASYNC FUNCTION
                // ========================================

                const foreverFunction = `
async def ${foreverFunctionName}():
${indent(foreverHandler || "    pass")}
`;

                // ========================================
                // TẠO ROUTINE
                // ========================================

                const foreverRoutine = `
coroutine.createRoutine(
    ${foreverFunctionName},
    1,
    3
)
`;

                // ========================================
                // TẠO FINAL PYTHON CODE
                // ========================================

                const code = `
import coroutine
import motor
import uasyncio
import gc;gc.collect()
import interactive
import board
from constants import *
import flag
import usercode
import timer

async def usercode_begin():
${indent(beginCode || "    pass")}

${foreverFunction}

async def usercode_setup():
    flag.remove(flag.PROGRAME_ONSTART)
${indent(foreverRoutine)}
`;

                // ========================================
                // UPLOAD
                // ========================================

                await uploader.upload(code);

                // alert("Upload thành công");

              } catch (err) {
                console.error("Upload failed:", err);
                alert("Upload thất bại");
              }
            }}
          >
            <Play />
          </Button>

          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await uploader.upload("");
              } catch (err) {
                console.error("Pause failed:", err);
              }
            }}
          >
            <Pause />
          </Button>
        </div>

        <div ref={blocklyDiv} style={{ width: "100%", height: "100%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,

          borderRadius: 6,
          // boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex",
          gap: 15,
        }}
      >
        <Button className="bg-white text-black"
          onClick={() => {
            const name = prompt("Nhập tên project:");
            if (!name) return;

            const ws = getWorkspaceSafe();
            if (!ws) return;

            try {
              const p = createProject(name, ws);
              setActiveProjectId(p.id);
              setProjects(getProjects());
            } catch (err) {
              console.error("Failed to create project", err);
              alert("Lưu project thất bại.");
            }
          }}
        >
          <Save />
        </Button>
        <Popover open={openProjects} onOpenChange={setOpenProjects}>
          <PopoverTrigger asChild>
            <Button variant="outline"><ChartNoAxesGantt /></Button>
          </PopoverTrigger>

          <PopoverContent className="w-56 p-2">
            {projects.length === 0 && (
              <div className="text-xs text-muted-foreground">
                Chưa có project nào
              </div>
            )}

            <div className="flex flex-col gap-1">
              {projects.map((p) => (
                <Button
                  key={p.id}
                  variant={p.id === activeProjectId ? "default" : "secondary"}
                  className="justify-start"
                  onClick={() => {
                    const ws = getWorkspaceSafe();
                    if (!ws) return;

                    try {
                      loadProject(p.id, ws);
                      setActiveProjectId(p.id);
                      setOpenProjects(false); // 👈 đóng popover
                      setProjects(getProjects());
                    } catch (err) {
                      console.error("Failed to load project", err);
                      alert("Không thể load project — dữ liệu có thể bị hỏng.");
                    }
                  }}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button className="bg-white text-black"
          onClick={() => {
            const ws = getWorkspaceSafe();
            if (!ws) return;
            try {
              const code = pythonGenerator.workspaceToCode(ws);
              alert(code);
            } catch (err) {
              console.error("Failed to generate python code", err);
              alert("Không thể sinh Python từ workspace.");
            }
          }}
        >
          <Code />
        </Button>
      </div>
    </div>
  );
}