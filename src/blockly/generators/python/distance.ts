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
const PORT_MAP: Record<string, string> = {
  "ControllerSub.PORT1": "board.PORT1",
  "ControllerSub.PORT2": "board.PORT2",
  "ControllerSub.PORT3": "board.PORT3",
  "ControllerSub.PORT4": "board.PORT4",
  "ControllerSub.PORT5": "board.PORT5",
  "ControllerSub.PORT6": "board.PORT6",

  "Controller.PORT1": "board.PORT1",
  "Controller.PORT2": "board.PORT2",
  "Controller.PORT3": "board.PORT3",
  "Controller.PORT4": "board.PORT4",
  "Controller.PORT5": "board.PORT5",
  "Controller.PORT6": "board.PORT6",
};

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
