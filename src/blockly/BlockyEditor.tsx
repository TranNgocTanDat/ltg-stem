import { useEffect, useRef, useState } from "react";
import * as vi from "blockly/msg/vi";
import * as Blockly from "blockly";
import { toast } from "sonner";

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
  renameProject,
  duplicateProject,
  deleteProject,
  createEmptyProject,
} from "@/blockly/projects";
import {
  ChartNoAxesGantt,
  Code,
  Pause,
  Play,
  Save,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import CreateProjectDialog from "./CreateProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";

export default function BlocklyEditor() {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const activeCategoryRef = useRef<string | null>(null);

  const [projects, setProjects] = useState(getProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [openProjects, setOpenProjects] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [editingProjectName, setEditingProjectName] =
    useState("");

  const [createProjectOpen, setCreateProjectOpen] =
    useState(false);

  const [deleteProjectOpen, setDeleteProjectOpen] =
    useState(false);

  const [projectToDelete, setProjectToDelete] =
    useState<{
      id: string;
      name: string;
    } | null>(null);

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

  // const createDefaultForever = (workspace: Blockly.WorkspaceSvg) => {
  //   if (workspace.getAllBlocks(false).some((b) => b.type === "forever")) return;
  //   const block = workspace.newBlock("forever");
  //   block.initSvg();
  //   block.render();
  //   block.moveBy(300, 200);
  // };

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
    // createDefaultForever(workspace);

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
            disabled={isUploading}
            onClick={async () => {
              // Chặn mọi lần upload trùng
              if (isUploading) {
                return;
              }

              // Bắt đầu upload → khóa nút
              setIsUploading(true);
              const ws = getWorkspaceSafe();

              if (!ws) {
                toast.error("Workspace không tồn tại");
                setIsUploading(false);
                return;
              }

              try {
                pythonGenerator.init(ws);

                // ========================================
                // RESET
                // ========================================

                let beginCode = "";
                let foreverHandler = "";
                let foreverId = "";

                const distancePorts = new Set<string>();

                // ========================================
                // LẤY TẤT CẢ BLOCK
                // ========================================

                const allBlocks =
                  ws.getAllBlocks(false);

                // ========================================
                // TÌM DISTANCE SENSOR
                // ========================================

                for (const block of allBlocks) {
                  if (
                    block.type ===
                    "distance_sensor_read"
                  ) {
                    const port =
                      block.getFieldValue("PORT") ||
                      "ControllerSub.PORT1";

                    distancePorts.add(port);
                  }
                  if (
                    block.type ===
                    "distance_sensor_detect"
                  ) {
                    distancePorts.add(
                      "ControllerSub.PORT1"
                    );
                  }
                }

                console.log(
                  "========== DISTANCE PORTS =========="
                );

                console.log(
                  Array.from(distancePorts)
                );

                // ========================================
                // TOP BLOCKS
                // ========================================

                const blocks =
                  ws.getTopBlocks(true);

                // ========================================
                // ON START + FOREVER
                // ========================================

                for (const block of blocks) {

                  // ======================================
                  // ON START
                  //
                  // Workspace thực tế của bạn:
                  // grobot_general_onstart
                  // ======================================

                  if (
                    block.type ===
                    "grobot_general_onstart" ||
                    block.type === "on_start"
                  ) {
                    beginCode =
                      pythonGenerator.blockToCode(
                        block
                      ) as string;

                    console.log(
                      "========== ON START CODE =========="
                    );

                    console.log(beginCode);
                  }

                  // ======================================
                  // FOREVER
                  // ======================================

                  if (
                    block.type === "forever"
                  ) {
                    foreverId = block.id;

                    foreverHandler =
                      pythonGenerator.blockToCode(
                        block
                      ) as string;

                    console.log(
                      "========== FOREVER CODE =========="
                    );

                    console.log(foreverHandler);

                    console.log(
                      "FOREVER BLOCK ID:",
                      foreverId
                    );
                  }
                }

                // ========================================
                // FOREVER FUNCTION NAME
                // ========================================

                const foreverFunctionName =
                  `routine_${foreverId.replace(
                    /[^a-zA-Z0-9_]/g,
                    "_"
                  )}`;

                console.log(
                  "========== FOREVER FUNCTION NAME =========="
                );

                console.log(
                  foreverFunctionName
                );

                // ========================================
                // FOREVER FUNCTION
                // ========================================

                const foreverFunction = `
async def ${foreverFunctionName}():
${indent(
                  foreverHandler || "    pass"
                )}
`;

                // ========================================
                // FOREVER ROUTINE
                // ========================================

                const foreverRoutine = `
coroutine.createRoutine(
    ${foreverFunctionName},
    1,
    3
)
`;

                // ========================================
                // DISTANCE OBJECTS
                // ========================================

                let distanceObjects = "";
                let distanceBegin = "";

                for (
                  const port of distancePorts
                ) {

                  // --------------------------------------
                  // ControllerSub.PORT1
                  //      ↓
                  // PORT1
                  //      ↓
                  // board.PORT1
                  // --------------------------------------

                  const portName =
                    port.split(".").pop() ||
                    "PORT1";

                  const portNumber =
                    Number(
                      portName.replace(
                        "PORT",
                        ""
                      )
                    ) || 1;

                  const boardPort =
                    `board.PORT${portNumber}`;

                  const sensorName =
                    `distance_sensor_${portNumber}`;

                  distanceObjects +=
                    `${sensorName} = distancesensor.DistanceSensor(${boardPort})\n`;

                  distanceBegin +=
                    `    await ${sensorName}.begin()\n`;
                }

                console.log(
                  "========== DISTANCE OBJECTS =========="
                );

                console.log(distanceObjects);

                console.log(
                  "========== DISTANCE BEGIN =========="
                );

                console.log(distanceBegin);

                // ========================================
                // FINAL PYTHON CODE
                // ========================================

                const code = `
import coroutine
import pixel
import motor
import uasyncio
import gc;gc.collect()
import interactive
import board
from constants import *
import flag
import usercode
import timer
import buzzer
import distancesensor

${distanceObjects}

async def usercode_begin():
${indent(
                  beginCode || "    pass"
                )}

${foreverFunction}

async def usercode_setup():
    flag.remove(flag.PROGRAME_ONSTART)
${distanceBegin}
${indent(
                  foreverRoutine
                )}
`;

                // ========================================
                // LOG FINAL CODE
                // ========================================

                console.log(
                  "================================================"
                );

                console.log(
                  "========== FINAL PYTHON CODE =========="
                );

                console.log(
                  "================================================"
                );

                console.log(code);

                console.log(
                  "================================================"
                );

                console.log(
                  "========== CODE LENGTH =========="
                );

                console.log(code.length);

                console.log(
                  "================================================"
                );

                // ========================================
                // UPLOAD
                // ========================================

                console.log(
                  "========== START UPLOAD =========="
                );

                await uploader.upload(code);


                console.log(
                  "========== UPLOAD SUCCESS =========="
                );
                toast.success("Nạp code thành công!");

              } catch (err) {

                console.error(
                  "========== UPLOAD FAILED =========="
                );

                console.error(err);

                if (
                  err instanceof Error &&
                  err.message === "BLE_NOT_CONNECTED"
                ) {
                  toast.error("Chưa kết nối Não");
                } else {
                  toast.error("Nạp code thất bại");
                }

              } finally {

                // Upload xong hoặc upload lỗi
                // đều cho phép nạp lần tiếp theo
                setIsUploading(false);

                console.log(
                  "========== READY FOR NEXT UPLOAD =========="
                );
              }
            }}
          >
            <Play />
          </Button>

          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await uploader.stop();
                toast.success("Đã dừng chương trình");
              } catch (err) {
                console.error("Pause failed:", err);
                toast.error("Dừng chương trình thất bại");
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
        <Button
          className="bg-white text-black"
          onClick={() => {
            const ws = getWorkspaceSafe();

            if (!ws) {
              toast.error("Workspace không tồn tại");
              return;
            }

            try {
              // Đã có project → cập nhật project hiện tại
              if (activeProjectId) {
                updateProject(
                  activeProjectId,
                  ws
                );

                setProjects(getProjects());

                toast.success("Đã lưu project");
                return;
              }

              // Chưa có project → tạo project mới
              const name = prompt("Nhập tên project mới:");

              if (name === null) {
                return;
              }

              const projectName = name.trim() || "Untitled";

              const project = createProject(
                projectName,
                ws
              );

              setActiveProjectId(project.id);

              setProjects(getProjects());

              toast.success(
                `Đã tạo project "${project.name}"`
              );
            } catch (err) {
              console.error(
                "Save project failed:",
                err
              );

              toast.error(
                "Không thể lưu project"
              );
            }
          }}
        >
          <Save />
        </Button>
        <Popover open={openProjects} onOpenChange={setOpenProjects}>
          <PopoverTrigger asChild>
            <Button variant="outline"><ChartNoAxesGantt /></Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-2">
            <Button
              className="mb-2 w-full justify-start"
              onClick={() => {
                setCreateProjectOpen(true);
              }}
            >
              + Tạo project mới
            </Button>
            {projects.length === 0 ? (
              <div className="px-2 py-3 text-xs text-muted-foreground">
                Chưa có project nào
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {projects.map((p) => {
                  const isActive = p.id === activeProjectId;

                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-1 rounded-md p-1 ${isActive
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                        }`}
                    >
                      {/* Tên project */}
                      <Button
                        variant="ghost"
                        className="min-w-0 flex-1 justify-start"
                        onClick={() => {
                          const ws = getWorkspaceSafe();

                          if (!ws) {
                            toast.error(
                              "Workspace không tồn tại"
                            );
                            return;
                          }

                          try {
                            loadProject(p.id, ws);

                            setActiveProjectId(p.id);
                            setOpenProjects(false);
                            setProjects(getProjects());

                            toast.success(
                              `Đã mở "${p.name}"`
                            );
                          } catch (err) {
                            console.error(
                              "Failed to load project",
                              err
                            );

                            toast.error(
                              "Không thể mở project."
                            );
                          }
                        }}
                      >
                        <span className="mr-2 shrink-0">
                          {isActive ? "✓" : "📂"}
                        </span>

                        {editingProjectId === p.id ? (
                          <input
                            autoFocus
                            value={editingProjectName}
                            onChange={(e) =>
                              setEditingProjectName(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const newName =
                                  editingProjectName.trim();

                                if (!newName) {
                                  toast.error(
                                    "Tên project không được để trống"
                                  );
                                  return;
                                }

                                try {
                                  renameProject(
                                    p.id,
                                    newName
                                  );

                                  setProjects(
                                    getProjects()
                                  );

                                  setEditingProjectId(null);
                                  setEditingProjectName("");

                                  toast.success(
                                    "Đã đổi tên project"
                                  );
                                } catch (err) {
                                  console.error(
                                    "Rename project failed",
                                    err
                                  );

                                  toast.error(
                                    "Không thể đổi tên project"
                                  );
                                }
                              }

                              if (e.key === "Escape") {
                                setEditingProjectId(null);
                                setEditingProjectName("");
                              }
                            }}
                            onBlur={() => {
                              const newName =
                                editingProjectName.trim();

                              if (!newName) {
                                setEditingProjectId(null);
                                setEditingProjectName("");
                                return;
                              }

                              try {
                                renameProject(
                                  p.id,
                                  newName
                                );

                                setProjects(
                                  getProjects()
                                );

                                setEditingProjectId(null);
                                setEditingProjectName("");
                              } catch (err) {
                                console.error(
                                  "Rename project failed",
                                  err
                                );

                                toast.error(
                                  "Không thể đổi tên project"
                                );
                              }
                            }}
                            className="h-8 min-w-0 flex-1 rounded border bg-background px-2 text-sm outline-none"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          />
                        ) : (
                          <span className="truncate">
                            {p.name}
                          </span>
                        )}
                      </Button>

                      {/* Đổi tên */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        title="Đổi tên"
                        onClick={() => {
                          setEditingProjectId(p.id);
                          setEditingProjectName(p.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Nhân bản */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        title="Nhân bản"
                        onClick={() => {
                          try {
                            const copy =
                              duplicateProject(p.id);

                            const ws =
                              getWorkspaceSafe();

                            if (ws) {
                              loadProject(
                                copy.id,
                                ws
                              );
                            }

                            setActiveProjectId(
                              copy.id
                            );

                            setProjects(
                              getProjects()
                            );

                            setOpenProjects(false);

                            toast.success(
                              `Đã nhân bản "${p.name}"`
                            );
                          } catch (err) {
                            console.error(
                              "Duplicate project failed",
                              err
                            );

                            toast.error(
                              "Không thể nhân bản project"
                            );
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                        title="Xóa"
                        onClick={() => {
                          setProjectToDelete({
                            id: p.id,
                            name: p.name,
                          });

                          setDeleteProjectOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

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
              toast.error("Không thể sinh Python từ workspace.");
            }
          }}
        >
          <Code />
        </Button>
      </div>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onCreate={(name) => {
          try {
            const project =
              createEmptyProject(name);

            const ws = getWorkspaceSafe();

            if (ws) {
              ws.clear();

              loadProject(
                project.id,
                ws
              );
            }

            setActiveProjectId(
              project.id
            );

            setProjects(
              getProjects()
            );

            setOpenProjects(false);

            toast.success(
              `Đã tạo project "${project.name}"`
            );
          } catch (err) {
            console.error(
              "Create project failed",
              err
            );

            toast.error(
              "Không thể tạo project"
            );
          }
        }}
      />
      <DeleteProjectDialog
        open={deleteProjectOpen}
        onOpenChange={setDeleteProjectOpen}
        projectName={
          projectToDelete?.name || ""
        }
        onConfirm={() => {
          if (!projectToDelete) {
            return;
          }

          try {
            deleteProject(
              projectToDelete.id
            );

            const updatedProjects =
              getProjects();

            setProjects(
              updatedProjects
            );

            const newActiveId =
              getActiveProjectId();

            setActiveProjectId(
              newActiveId
            );

            const ws =
              getWorkspaceSafe();

            if (ws) {
              if (newActiveId) {
                loadProject(
                  newActiveId,
                  ws
                );
              } else {
                ws.clear();
              }
            }

            setProjectToDelete(null);

            toast.success(
              "Đã xóa project"
            );
          } catch (err) {
            console.error(
              "Delete project failed",
              err
            );

            toast.error(
              "Không thể xóa project"
            );
          }
        }}
      />
    </div>
  );
}