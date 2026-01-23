import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import * as vi from "blockly/msg/vi";
import "blockly/blocks";
import "@/blockly";

import Sidebar from "./Sidebar";
import { makeCodeTheme } from "./makeCodeTheme";
import { EMPTY_TOOLBOX } from "./emptyToolbox";
import type { FlyoutItem } from "./blocklyTypes";

import { pythonGenerator } from "blockly/python";
import { javascriptGenerator } from "blockly/javascript";
import { Button } from "@/components/ui/button";

import { runProgram, stopProgram } from "@/blockly/runtime/runner";

export default function BlocklyEditor() {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // ===== INIT BLOCKLY =====
  useEffect(() => {
    if (!blocklyDiv.current) return;

    Blockly.setLocale(vi as unknown as { [key: string]: string });

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      renderer: "geras",
      theme: makeCodeTheme,
      trashcan: true,
      toolbox: EMPTY_TOOLBOX,
      toolboxPosition: "start",
    });

    return () => {
      workspaceRef.current?.dispose();
      workspaceRef.current = null;
    };
  }, []);

  // ===== SHOW CATEGORY =====
  const showCategory = (contents: FlyoutItem[]) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const flyout = workspace.getFlyout();
    if (!flyout) return;

    flyout.hide();
    flyout.show({
      kind: "flyoutToolbox",
      contents,
    });

    flyout.getWorkspace().scrollbar?.set(0, 0, false);
  };

  // ===== GENERATE CODE =====
  const generatePythonCode = () => {
    if (!workspaceRef.current) return "";
    return pythonGenerator.workspaceToCode(workspaceRef.current);
  };

  const generateJsCode = () => {
    if (!workspaceRef.current) return "";
    return javascriptGenerator.workspaceToCode(workspaceRef.current);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelect={showCategory} />

      <div style={{ flex: 1, position: "relative" }}>
        {/* ===== CONTROL BAR ===== */}
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
            onClick={() => {
              const code = generatePythonCode();
              console.log("🐍 PYTHON CODE:\n", code);
              alert(code);
            }}
          >
            Xem code Python
          </Button>

          <Button
            onClick={() => {
              const code = generateJsCode();
              console.log("🚀 RUN JS:\n", code);
              runProgram(code);
            }}
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
