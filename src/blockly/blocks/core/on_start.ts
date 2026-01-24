import * as Blockly from "blockly";

Blockly.Blocks["on_start"] = {
  init() {
    this.appendDummyInput()
      .appendField("Khởi động chương trình");

    this.appendStatementInput("DO");  

    this.setColour(120);
    this.setDeletable(true);
    this.setMovable(true);
  },
};
