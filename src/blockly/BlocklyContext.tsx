// src/blockly/BlocklyContext.tsx
import { createContext, useContext } from "react";
import * as Blockly from "blockly";

type BlocklyContextType = {
  workspace: Blockly.WorkspaceSvg | null;
  run: () => void;
  stop: () => void;
  showPython: () => void;
  saveProject: () => void;
};

export const BlocklyContext = createContext<BlocklyContextType | null>(null);

export const useBlockly = () => {
  const ctx = useContext(BlocklyContext);
  if (!ctx) throw new Error("useBlockly must be used inside provider");
  return ctx;
};
