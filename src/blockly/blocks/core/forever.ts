import * as Blockly from "blockly";

Blockly.Blocks["forever"] = {
  init() {
    this.appendDummyInput().appendField("♾ lặp mãi mãi");

    this.appendStatementInput("DO");

    this.setColour(160);
    this.setDeletable(true);
    this.setMovable(true);
  },
};
