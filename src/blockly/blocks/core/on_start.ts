import * as Blockly from "blockly";

Blockly.Blocks["on_start"] = {
  init() {
    this.appendDummyInput().appendField("Bắt đầu chương trình");

    this.appendStatementInput("DO");

    this.setColour("#0A909F");
    this.setDeletable(true);
    this.setMovable(true);
  },
};


