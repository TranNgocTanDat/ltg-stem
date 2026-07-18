import { pythonGenerator } from "blockly/python";

pythonGenerator.forBlock["robot_forward"] = function(block){

    const power =
        pythonGenerator.valueToCode(
            block,
            "POWER",
            3
        ) || "0";

    return `
await motor.forward(${power},0,3)
`;
}

pythonGenerator.forBlock["robot_forward_ms"] = function (block) {
  const power =
    pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  const time =
    pythonGenerator.valueToCode(block, "TIME", 3) || "1000";

  return `await motor.forward(${power}, ${time}, 2)\n`;
};

pythonGenerator.forBlock["robot_backward"] = function(block){

    const power =
        pythonGenerator.valueToCode(
            block,
            "POWER",
            3
        ) || "0";

    return `
await motor.backward(${power},0,3)
`;
}

pythonGenerator.forBlock["robot_backward_ms"] = function (block) {
  const power =
    pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  const time =
    pythonGenerator.valueToCode(block, "TIME", 3) || "1000";

  return `await motor.backward(${power}, ${time}, 2)\n`;
};

pythonGenerator.forBlock["robot_stop"] = function() {
  return `await motor.stop()\n`;
};