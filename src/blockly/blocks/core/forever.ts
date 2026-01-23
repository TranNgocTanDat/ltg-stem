import * as Blockly from "blockly";

Blockly.Blocks["forever"] = {
  init() {
    this.appendDummyInput()
      .appendField("🔁 lặp lại mãi mãi");

    this.appendStatementInput("DO")
      .appendField("thực hiện");

    this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};
