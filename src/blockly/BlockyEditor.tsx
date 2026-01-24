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

  // ===== FLYOUT UTILS =====
  const getFlyout = (workspace: Blockly.WorkspaceSvg) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspace.getFlyout() as any;

  const hideFlyout = (workspace: Blockly.WorkspaceSvg) => {
    const flyout = getFlyout(workspace);
    if (!flyout) return;

    // 1️⃣ Ẩn SVG flyout hoàn toàn
    if (flyout.svgGroup_) {
      flyout.svgGroup_.style.display = "none";
    }

    // 2️⃣ Tắt scrollbar logic (phòng trường hợp render lại)
    flyout.scrollbar_?.setVisible(false);

    // 3️⃣ Resize workspace để KHÔNG chừa chỗ
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

  // ===== INIT WORKSPACE =====
  useEffect(() => {
    if (!blocklyDiv.current) return;
    if (workspaceRef.current) return;

    Blockly.setLocale(vi as unknown as Record<string, string>);

    const workspace = Blockly.inject(blocklyDiv.current, {
      renderer: "geras",
      theme: makeCodeTheme,
      trashcan: true,
      toolbox: EMPTY_TOOLBOX, // ❗ BẮT BUỘC
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

    // ❗ KHÔNG MỞ CATEGORY → ẨN FLYOUT NGAY
    hideFlyout(workspace);

    // eslint-disable-next-line react-hooks/immutability
    createDefaultStart(workspace);
    // eslint-disable-next-line react-hooks/immutability
    createDefaultForever(workspace);

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, []);

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
    block.moveBy(200, 200);
  };

  // ===== UPDATE FLYOUT =====
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFlyout = (toolbox: any, show: boolean) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    workspace.updateToolbox(toolbox);

    if (show) {
      showFlyout(workspace);
    } else {
      hideFlyout(workspace);
    }
  };

  // ===== CATEGORY HANDLER =====
  const handleSelectCategory = (id: string) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    // ĐÓNG CATEGORY
    if (activeCategory === id) {
      setActiveCategory(null);
      updateFlyout(EMPTY_TOOLBOX, false);
      return;
    }

    // MỞ CATEGORY
    setActiveCategory(id);
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
