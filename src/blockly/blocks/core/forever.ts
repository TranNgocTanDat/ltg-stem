import * as Blockly from "blockly";

// Blockly.Blocks["forever"] = {
//   init() {
//     this.appendDummyInput().appendField("♾ lặp mãi mãi");

//     this.appendStatementInput("HANDLER");

//     this.setColour(160);
//     this.setDeletable(true);
//     this.setMovable(true);
//     this.setTooltip("Lặp lại các lệnh bên trong mãi mãi");

//   },
// };


Blockly.Blocks["forever"] = {
  init() {
    this.appendDummyInput().appendField("♾ lặp mãi mãi");

    this.appendStatementInput("HANDLER");

    this.setColour("#36B34D");
    this.setDeletable(true);
    this.setMovable(true);
  },
};