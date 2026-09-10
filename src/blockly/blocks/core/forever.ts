import * as Blockly from "blockly";


Blockly.Blocks["forever"] = {
  init() {
    this.appendDummyInput().appendField("♾ Lặp mãi mãi");

    this.appendStatementInput("HANDLER");

    this.setColour("#36B34D");

    // Không nối với block khác
    this.setPreviousStatement(false);
    this.setNextStatement(false);

    this.setDeletable(true);
    this.setMovable(true);
  },
};

/* =========================
 * 🔁 REPEAT
 * ========================= */
Blockly.Blocks["controls_repeat_ext"] = {
  init() {
    this.appendValueInput("TIMES").setCheck("Number").appendField("lặp lại");

    this.appendStatementInput("DO").appendField("lần");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#F5A623");
    this.setTooltip("Lặp lại các lệnh nhiều lần");
  },
};

Blockly.Blocks["controls_whileUntil"] = {
  init() {
    this.appendValueInput("COND").setCheck("Boolean").appendField("trong khi");

    this.appendStatementInput("DO").appendField("thực hiện");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#50CC74");
    this.setTooltip("Lặp lại các lệnh khi điều kiện đúng");
  },
};

Blockly.Blocks["wait_until"] = {
  init() {
    this.appendValueInput("COND")
      .setCheck("Boolean")
      .appendField("chờ đến khi");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#50CC74");
    this.setTooltip("Chờ cho đến khi điều kiện đúng");
  },
};

Blockly.Blocks["pxt_controls_for"] = {
  init() {
    this.appendDummyInput()
      .appendField("lặp với")
      .appendField(new Blockly.FieldVariable("i"), "VAR");

    this.appendValueInput("TO").setCheck("Number").appendField("đến");

    this.appendStatementInput("DO").appendField("thực hiện");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#50CC74");

    this.setTooltip("Lặp lại các lệnh với biến đếm");
  },
};
