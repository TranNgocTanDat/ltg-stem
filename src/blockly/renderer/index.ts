// src/blockly/renderer/index.ts
import * as Blockly from "blockly";
import { CustomRenderer } from "./custom_renderer";

Blockly.blockRendering.register(
  "custom_renderer",
  CustomRenderer,
);
