import * as Blockly from "blockly";

export class CustomConstants extends Blockly.blockRendering.ConstantProvider {
  override init() {
    super.init();

    // Bo góc
    // this.CORNER_RADIUS = 8;

    // // Chiều cao tối thiểu
    // this.MIN_BLOCK_HEIGHT = 36;

    // // Notch
    // this.NOTCH_WIDTH = 18;
    // this.NOTCH_HEIGHT = 6;

    // // Padding
    // this.MEDIUM_PADDING = 12;
    // this.SMALL_PADDING = 6;
  }
}