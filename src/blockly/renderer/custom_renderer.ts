// src/blockly/renderer/custom_renderer.ts
import * as Blockly from "blockly";
import { CustomConstants } from "./custom_constants";

export class CustomRenderer extends Blockly.blockRendering.Renderer {
  constructor(name: string) {
    super(name);
  }

  override makeConstants_() {
    return new CustomConstants();
  }
}
