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

    this.CORNER_RADIUS = 6;

    this.MIN_BLOCK_HEIGHT = 36;

    this.NOTCH_WIDTH = 18;
    this.NOTCH_HEIGHT = 6;

    this.TAB_HEIGHT = 24;
    this.TAB_WIDTH = 12;

    this.MEDIUM_PADDING = 12;
    this.SMALL_PADDING = 6;
  }
}
