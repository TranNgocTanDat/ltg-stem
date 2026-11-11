import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/**
 * =========================================================
 * LINE SENSOR PYTHON GENERATOR
 * =========================================================
 *
 * Nguồn: 2 file nhà cung cấp
 * - blocks.txt makecode.grobot_line_readsensor2:
 *   await {object}.get_channel({port_map[channel]}, {rid})
 *   với {object} = line_sensor.LineSensor(portMapping(port))
 * - blocks.txt makecode.grobot_line_readmask2:
 *   await {object}.check_all([{c1}, {c2}], {rid})
 *   (đúng dạng 2 mắt trên object từng cổng,
 *   với {object} = line_sensor.LineSensor(portMapping(port)))
 *
 * Firmware API:
 *
 * line_sensor_1 = line_sensor.LineSensor(board.PORT1)
 * await line_sensor_1.begin()
 * await line_sensor_1.get_channel(0, 3)
 * await line_sensor_1.check_all([0, 0], 3)
 *
 * Quy ước giá trị mắt (port_map trong blockly.txt):
 * 0 = DetectLine (vạch đen), 1 = DetectSpace (nền sáng)
 *
 * Giữ nguyên quy ước của repo: hard-code 3 thay cho
 * gen.rid(block) của nhà cung cấp, không sửa code cũ.
 *
 * =========================================================
 */

function lineSensorName(block: Blockly.Block): string {
  const port = block.getFieldValue("PORT") || "ControllerSub.PORT1";

  // ==========================================
  // PORT
  //
  // ControllerSub.PORT1
  //       ↓
  // PORT1
  //       ↓
  // line_sensor_1
  // ==========================================

  const portName = port.split(".").pop() || "PORT1";

  const portNumber = Number(portName.replace("PORT", "")) || 1;

  return `line_sensor_${portNumber}`;
}

pythonGenerator.forBlock["line_sensor_read"] = function (
  block: Blockly.Block,
) {
  const channel = block.getFieldValue("CHANNEL") || "0";

  const sensorName = lineSensorName(block);

  // get_channel trả về 0 khi ở trên vạch đen,
  // 1 khi ở trên nền sáng (theo port_map nhà cung cấp).
  return [
    `(await ${sensorName}.get_channel(${channel}, 3)) == 0`,
    3,
  ];
};

pythonGenerator.forBlock["line_sensor_check"] = function (
  block: Blockly.Block,
) {
  const s1 = block.getFieldValue("S1") || "0";
  const s2 = block.getFieldValue("S2") || "0";

  const sensorName = lineSensorName(block);

  return [
    `await ${sensorName}.check_all([${s1}, ${s2}], 3)`,
    3,
  ];
};
