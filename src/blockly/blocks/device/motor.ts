import * as Blockly from "blockly";

Blockly.Blocks["robot_forward"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField("🤖 Robot:")
      .appendField("Đi thẳng với tốc độ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#2CA8B8");

    this.setTooltip("Robot đi thẳng");
  },
};

Blockly.Blocks["robot_forward_ms"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField("Robot: Đi thẳng với tốc độ");

    this.appendDummyInput().appendField("trong");

    this.appendValueInput("TIME").setCheck("Number").appendField("ms");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#00ACC1");
  },
};

Blockly.Blocks["robot_backward"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField("🤖 Robot:")
      .appendField("Đi lùi với tốc độ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#2CA8B8");

    this.setTooltip("Robot đi lùi");
  },
};

Blockly.Blocks["robot_backward_ms"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField("Robot: Đi lùi với tốc độ");

    this.appendDummyInput().appendField("trong");

    this.appendValueInput("TIME").setCheck("Number").appendField("ms");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#00ACC1");
  },
};

Blockly.Blocks["robot_stop"] = {
  init() {
    this.appendDummyInput().appendField("Robot: Dừng lại");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#F44336");
  },
};

Blockly.Blocks["robot_forward"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField("🤖 Robot:")
      .appendField("Đi thẳng với tốc độ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#2CA8B8");

    this.setTooltip("Robot đi thẳng");
  },
};
