import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/**
 * =========================================================
 * DISTANCE SENSOR PYTHON GENERATOR
 * =========================================================
 *
 * Firmware API:
 *
 * distance_sensor_1 =
 *     distancesensor.DistanceSensor(board.PORT1)
 *
 * await distance_sensor_1.begin()
 *
 * await distance_sensor_1.read_distance(
 *     distancesensor.Centimeter,
 *     3
 * )
 *
 * =========================================================
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars


pythonGenerator.forBlock["distance_sensor_read"] = function (
  block: Blockly.Block,
) {
  const unit = block.getFieldValue("UNIT") || "UnitLength.Centimeter";

  const port = block.getFieldValue("PORT") || "ControllerSub.PORT1";

  // ==========================================
  // UNIT
  //
  // UnitLength.Centimeter
  //       ↓
  // Centimeter
  // ==========================================

  const unitName = unit.split(".").pop() || "Centimeter";

  // ==========================================
  // PORT
  //
  // ControllerSub.PORT1
  //       ↓
  // PORT1
  //       ↓
  // distance_sensor_1
  // ==========================================

  const portName = port.split(".").pop() || "PORT1";

  const portNumber = Number(portName.replace("PORT", "")) || 1;

  const sensorName = `distance_sensor_${portNumber}`;

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("========== DISTANCE GENERATOR ==========");

  console.log("UNIT:", unit);
  console.log("UNIT NAME:", unitName);

  console.log("PORT:", port);
  console.log("PORT NAME:", portName);

  console.log("SENSOR:", sensorName);

  console.log(
    "CODE:",
    `await ${sensorName}.read_distance(distancesensor.${unitName}, 3)`,
  );

  // ==========================================
  // RETURN VALUE
  // ==========================================

  return [
    `await ${sensorName}.read_distance(distancesensor.${unitName}, 3)`,
    3,
  ];
};

pythonGenerator.forBlock["distance_sensor_detect"] = function () {
  const code =
    `(await distance_sensor_1.read_distance(` +
    `distancesensor.Centimeter, 3)) <= 10`;

  return [code, 0];
};
