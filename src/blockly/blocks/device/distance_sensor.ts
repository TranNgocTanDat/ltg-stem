import * as Blockly from "blockly";

/**
 * =========================================================
 * DISTANCE SENSOR
 * =========================================================
 *
 * Firmware API:
 *
 * distancesensor.DistanceSensor(board.PORT1)
 * await sensor.begin()
 * await sensor.read_distance(distancesensor.Centimeter, rid)
 *
 * =========================================================
 */

Blockly.Blocks["distance_sensor_read"] = {
  init() {
    this.appendDummyInput()
      .appendField("khoảng cách")
      .appendField(
        new Blockly.FieldDropdown([
          ["cm", "UnitLength.Centimeter"],
          ["mm", "UnitLength.Millimeter"],
          ["inch", "UnitLength.Inch"],
        ]),
        "UNIT"
      )
      .appendField("tại cổng")
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "ControllerSub.PORT1"],
          ["2", "ControllerSub.PORT2"],
          ["3", "ControllerSub.PORT3"],
          ["4", "ControllerSub.PORT4"],
          ["5", "ControllerSub.PORT5"],
          ["6", "ControllerSub.PORT6"],
        ]),
        "PORT"
      );

    this.setOutput(true, "Number");

    this.setColour("#3B82F6");

    this.setTooltip(
      "Đọc khoảng cách từ cảm biến siêu âm"
    );

    this.setHelpUrl("");
  },
};

Blockly.Blocks["distance_sensor_detect"] = {
  init() {
    this.appendDummyInput()
      .appendField("mắt nhìn thấy vật");

    this.setOutput(true, "Boolean");

    this.setColour("#3B82F6");

    this.setTooltip(
      "Đúng khi cảm biến nhìn thấy vật trong khoảng cách 10 cm"
    );

    this.setHelpUrl("");
  },
};