import * as Blockly from "blockly";

/**
 * =========================================================
 * LOGIC COMPARE
 * =========================================================
 */

Blockly.Blocks["logic_compare"] = {
  init() {
    this.appendValueInput("A")
      .setCheck(null);

    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["=", "EQ"],
          ["≠", "NEQ"],
          ["<", "LT"],
          ["≤", "LTE"],
          [">", "GT"],
          [">=", "GTE"],
        ]),
        "OP"
      );

    this.appendValueInput("B")
      .setCheck(null);

    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setColour("#3BA1C5");

    this.setTooltip(
      "So sánh hai giá trị"
    );
  },
};


/**
 * =========================================================
 * LOGIC OPERATION
 * =========================================================
 */

Blockly.Blocks["logic_operation"] = {
  init() {
    this.appendValueInput("A")
      .setCheck("Boolean");

    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["và", '"AND"'],
          ["hoặc", '"OR"'],
        ]),
        "OP"
      );

    this.appendValueInput("B")
      .setCheck("Boolean");

    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setColour("#3BA1C5");

    this.setTooltip(
      "Kết hợp hai điều kiện bằng VÀ hoặc HOẶC"
    );
  },
};


/**
 * =========================================================
 * LOGIC BOOLEAN
 * =========================================================
 */

Blockly.Blocks["logic_boolean"] = {
  init() {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["đúng", "TRUE"],
          ["sai", "FALSE"],
        ]),
        "BOOL"
      );

    this.setOutput(true, "Boolean");
    this.setColour("#3BA1C5");

    this.setTooltip(
      "Giá trị đúng hoặc sai"
    );
  },
};


/**
 * =========================================================
 * LOGIC NEGATE
 * =========================================================
 */

Blockly.Blocks["logic_negate"] = {
  init() {
    this.appendValueInput("BOOL")
      .setCheck("Boolean")
      .appendField("không phải");

    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setColour("#3BA1C5");

    this.setTooltip(
      "Đảo ngược giá trị đúng/sai"
    );
  },
};

Blockly.Blocks["GetButtonOnboard"] = {
  init() {
    this.appendDummyInput()
      .appendField("nút nhấn trên bo mạch");

    this.setOutput(true, "Boolean");

    this.setColour("#3BA1C5");

    this.setTooltip(
      "Đọc trạng thái nút nhấn trên bo mạch"
    );
  },
};