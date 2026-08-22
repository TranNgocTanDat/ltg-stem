import * as Blockly from "blockly";

Blockly.Blocks["on_start"] = {
  init() {
    this.appendDummyInput()
      .appendField("Bắt đầu chương trình");

    this.appendStatementInput("DO");  

    this.setColour(120);
    this.setDeletable(true);
    this.setMovable(true);
  },
};

Blockly.Blocks["ltg_if"] = {
  init() {
    this.appendValueInput("IF0")
      .setCheck("Boolean")
      .appendField("nếu");

    this.appendStatementInput("DO0")
      .appendField("thì");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#4C97FF");
  },
};