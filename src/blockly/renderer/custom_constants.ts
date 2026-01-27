// src/blockly/renderer/custom_constants.ts
import * as Blockly from "blockly";

export class CustomConstants extends Blockly.blockRendering.ConstantProvider {
  BLOCK_PADDING: number | undefined;
  STATEMENT_TOP_SPACER: number | undefined;
  constructor() {
    super();
  }

  override init() {
    super.init();

    this.CORNER_RADIUS = 8;
    this.BLOCK_PADDING = 12;
    this.MIN_BLOCK_HEIGHT = 20;

    this.NOTCH_WIDTH = 40;
    this.NOTCH_HEIGHT = 8;
  }
}
