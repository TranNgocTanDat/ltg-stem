import * as Blockly from "blockly";

Blockly.Blocks["servo_set_angle"] = {
  init() {
    this.appendDummyInput()
      .appendField("servo tại cổng")
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "ControllerSub.PORT1"],
          ["2", "ControllerSub.PORT2"],
          ["3", "ControllerSub.PORT3"],
          ["4", "ControllerSub.PORT4"],
          ["5", "ControllerSub.PORT5"],
          ["6", "ControllerSub.PORT6"],
        ]),
        "PORT",
      );

    this.appendValueInput("ANGLE")
      .setCheck("Number")
      .appendField("góc quay");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Điều khiển servo quay đến góc chỉ định");
    this.setHelpUrl("");
  },
};