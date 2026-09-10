import * as Blockly from "blockly";

Blockly.Blocks["robot_delay"] = {
  init() {
    this.appendValueInput("TIME").setCheck("Number").appendField("Đợi");

    this.appendDummyInput().appendField("ms");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#9C27B0");

    this.setTooltip("Robot chờ trong khoảng thời gian");
  },
};
