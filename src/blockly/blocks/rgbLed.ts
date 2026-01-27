
import * as Blockly from "blockly";

Blockly.Blocks["rgb_led_set"] = {
  init() {
    this.appendDummyInput()
      .appendField("🎨 LED RGB cổng")
      .appendField(
        new Blockly.FieldDropdown([
          ["P0", "P0"],
          ["P1", "P1"],
          ["P2", "P2"],
          ["P3", "P3"],
          ["P4", "P4"],
        ]),
        "PORT",
      )
      .appendField("LED số")
      .appendField(
        new Blockly.FieldDropdown([
          ["Tất cả", "ALL"],
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
        ]),
        "INDEX",
      );

    this.appendDummyInput()
      .appendField("màu")
      .appendField(
        new Blockly.FieldDropdown([
          ["🔴 Đỏ", "RED"],
          ["🟢 Xanh lá", "GREEN"],
          ["🔵 Xanh dương", "BLUE"],
          ["🟡 Vàng", "YELLOW"],
          ["🟣 Tím", "PURPLE"],
          ["🔵 Cyan", "CYAN"],
          ["⚪ Trắng", "WHITE"],
          ["⚫ Tắt", "OFF"],
        ]),
        "COLOR",
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(20);
  },
};
