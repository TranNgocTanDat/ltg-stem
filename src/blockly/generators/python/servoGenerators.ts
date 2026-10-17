import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

pythonGenerator.forBlock["servo_set_angle"] = function (
  block: Blockly.Block,
) {
  const port =
    block.getFieldValue("PORT") || "ControllerSub.PORT1";

  const angle =
    pythonGenerator.valueToCode(block, "ANGLE", 99) || "90";

  const portName = port.split(".").pop() || "PORT1";
  const portNumber =
    Number(portName.replace("PORT", "")) || 1;

  const servoName = `servo_${portNumber}`;

  return `await ${servoName}.set_angle(${angle}, ${JSON.stringify(block.id)})\n`;
};