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
import { javascriptGenerator } from "blockly/javascript";
import { Button } from "@/components/ui/button";

import { runProgram, stopProgram } from "@/blockly/runtime/runner";

export default function BlocklyEditor() {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const activeCategoryRef = useRef<string | null>(null);

  // ===== FLYOUT UTILS =====
  const getFlyout = (workspace: Blockly.WorkspaceSvg) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspace.getFlyout() as any;

  const hideFlyout = (workspace: Blockly.WorkspaceSvg) => {
    const flyout = getFlyout(workspace);
    if (!flyout) return;

    if (flyout.svgGroup_) {
      flyout.svgGroup_.style.display = "none";
    }
    flyout.scrollbar_?.setVisible(false);
    Blockly.svgResize(workspace);
  };

  const showFlyout = (workspace: Blockly.WorkspaceSvg) => {
    const flyout = getFlyout(workspace);
    if (!flyout) return;

    if (flyout.svgGroup_) {
      flyout.svgGroup_.style.display = "block";
    }
    flyout.scrollbar_?.setVisible(false);
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

  // ===== DEFAULT BLOCKS =====
  const createDefaultStart = (workspace: Blockly.WorkspaceSvg) => {
    if (workspace.getAllBlocks(false).some(b => b.type === "on_start")) return;
    const block = workspace.newBlock("on_start");
    block.initSvg();
    block.render();
    block.moveBy(20, 200);
  };

  const createDefaultForever = (workspace: Blockly.WorkspaceSvg) => {
    if (workspace.getAllBlocks(false).some(b => b.type === "forever")) return;
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
      renderer: "custom_renderer",
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

    workspaceRef.current = workspace;

    // 🔥 VARIABLES AUTO-REFRESH
    workspace.addChangeListener(e => {
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

    workspace.addChangeListener(e => {
      if (!workspaceRef.current) return;
      if (activeCategory !== "functions") return;

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

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
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


    const category = CATEGORIES.find(c => c.id === id);
    if (!category) return;

    updateFlyout(buildFlyout(category.contents), true);
  };

  // ===== RENDER =====
  return (
    <div style={{ display: "flex", height: "calc(100vh - 4rem)", overflow: "hidden" }}>
      <Sidebar
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
      />

      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            background: "#fff",
            padding: 8,
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "flex",
            gap: 8,
          }}
        >
          <Button
            onClick={() =>
              alert(pythonGenerator.workspaceToCode(workspaceRef.current!))
            }
          >
            Xem Python
          </Button>

          <Button
            onClick={() =>
              runProgram(
                javascriptGenerator.workspaceToCode(workspaceRef.current!)
              )
            }
          >
            ▶ Chạy
          </Button>

          <Button variant="destructive" onClick={stopProgram}>
            ⏹ Dừng
          </Button>
        </div>

        <div ref={blocklyDiv} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
