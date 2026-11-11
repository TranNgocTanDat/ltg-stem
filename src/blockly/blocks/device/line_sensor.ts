import * as Blockly from "blockly";

/**
 * =========================================================
 * LINE SENSOR (CẢM BIẾN DÒ LINE)
 * =========================================================
 *
 * Nguồn: 2 file nhà cung cấp
 * - blocks.txt: makecode.grobot_line_readsensor2,
 *   makecode.grobot_line_readmask2,
 *   makecode.GetFL5Channel, makecode.GetFL5Channel_B
 * - blockly.txt (port_map):
 *   '"LineSensorSelector2.Sensor1"': 0, Sensor2: 1
 *   (chỉ có 2 mắt trong file nhà cung cấp)
 *   '"LineSensorState.DetectLine"': "0",
 *   '"LineSensorState.DetectSpace"': "1"
 *
 * Firmware API (theo nhà cung cấp):
 *
 * line_sensor_1 = line_sensor.LineSensor(board.PORT1)
 * await line_sensor_1.begin()
 * await line_sensor_1.get_channel(0, 3)
 * await line_sensor_1.check_all([0, 0], 3)
 *
 * Quy ước giá trị mắt (theo port_map của nhà cung cấp):
 * 0 = mắt đang ở trên vạch đen (DetectLine)
 * 1 = mắt đang ở trên nền sáng (DetectSpace)
 * Nếu mạch thật trả ngược lại thì chỉ cần đổi
 * "== 0" thành "== 1" trong generator.
 *
 * Giữ nguyên quy ước của repo: hard-code 3 thay cho
 * gen.rid(block) của nhà cung cấp, không sửa code cũ.
 *
 * =========================================================
 */

const PORT_OPTIONS: [string, string][] = [
  ["1", "ControllerSub.PORT1"],
  ["2", "ControllerSub.PORT2"],
  ["3", "ControllerSub.PORT3"],
  ["4", "ControllerSub.PORT4"],
  ["5", "ControllerSub.PORT5"],
  ["6", "ControllerSub.PORT6"],
];

const CHANNEL_OPTIONS: [string, string][] = [
  ["S1", "0"],
  ["S2", "1"],
];

// 0 = vạch đen, 1 = nền sáng (theo port_map nhà cung cấp)
const STATE_OPTIONS: [string, string][] = [
  ["vạch đen", "0"],
  ["nền sáng", "1"],
];

Blockly.Blocks["line_sensor_read"] = {
  init() {
    this.appendDummyInput()
      .appendField("mắt dò line")
      .appendField(
        new Blockly.FieldDropdown(CHANNEL_OPTIONS),
        "CHANNEL",
      )
      .appendField("tại cổng")
      .appendField(
        new Blockly.FieldDropdown(PORT_OPTIONS),
        "PORT",
      )
      .appendField("thấy vạch đen");

    this.setOutput(true, "Boolean");

    this.setColour("#3B82F6");

    this.setTooltip(
      "Đúng khi mắt dò line đã chọn đang ở trên vạch đen",
    );

    this.setHelpUrl("");
  },
};

Blockly.Blocks["line_sensor_check"] = {
  init() {
    this.appendDummyInput()
      .appendField("2 mắt dò line tại cổng")
      .appendField(
        new Blockly.FieldDropdown(PORT_OPTIONS),
        "PORT",
      )
      .appendField("khớp mẫu");

    this.appendDummyInput()
      .appendField("S1")
      .appendField(
        new Blockly.FieldDropdown(STATE_OPTIONS),
        "S1",
      )
      .appendField("S2")
      .appendField(
        new Blockly.FieldDropdown(STATE_OPTIONS),
        "S2",
      );

    this.setOutput(true, "Boolean");

    this.setColour("#3B82F6");

    this.setTooltip(
      "Đúng khi 2 mắt dò line khớp đúng mẫu vạch đen / nền sáng đã chọn",
    );

    this.setHelpUrl("");
  },
};
