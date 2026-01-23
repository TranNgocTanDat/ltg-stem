import * as Blockly from "blockly";

Blockly.Blocks["on_start"] = {
  init() {
    this.appendDummyInput()
      .appendField("🟢 Bắt đầu");

    this.appendStatementInput("DO")
      .appendField("thực hiện");

    this.setColour(120);
    this.setDeletable(false);
    this.setMovable(true);
  },
};
