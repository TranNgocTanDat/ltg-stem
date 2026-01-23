import * as Blockly from "blockly";

Blockly.Blocks["wait_ms"] = {
  init() {
    this.appendValueInput("TIME")
      .setCheck("Number")
      .appendField("⏱ đợi");

    this.appendDummyInput()
      .appendField("ms");

    this.setColour(230);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
};
