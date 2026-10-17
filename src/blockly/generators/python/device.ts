import { pythonGenerator } from "blockly/python";

pythonGenerator.forBlock["robot_forward"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "0";

  return `
await motor.forward(${power}, 0, 3)

`;
};

pythonGenerator.forBlock["robot_forward_ms"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  const time = pythonGenerator.valueToCode(block, "TIME", 3) || "1";

  // Frontend: giây → milliseconds
  const timeMs = `(${time} * 1000)`;

  return `await motor.forward(${power}, ${timeMs}, 2)\n`;
};

pythonGenerator.forBlock["robot_backward"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "0";

  return `
await motor.backward(${power},0,3)
`;
};

pythonGenerator.forBlock["robot_backward_ms"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  const time = pythonGenerator.valueToCode(block, "TIME", 3) || "1";
  const timeMs = `(${time} * 1000)`;

  return `await motor.backward(${power}, ${timeMs}, 2)\n`;
};

pythonGenerator.forBlock["robot_stop"] = function () {
  return `await motor.stop()\n`;
};

pythonGenerator.forBlock["robot_rotate_left"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  return `await motor.rotate_left(${power}, 3)\n`;
};

pythonGenerator.forBlock["robot_rotate_right"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  return `await motor.rotate_right(${power}, 3)\n`;
};

pythonGenerator.forBlock["robot_turn_left"] = function (block) {
  const power = pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  return `await motor.turn_left(${power}, 3)\n`;
};

// pythonGenerator.forBlock["robot_rotate_left_ms"] = function (block) {
//   const time = pythonGenerator.valueToCode(block, "TIME", 3) || "500";

//   return `await motor.rotate_left(80, 3)
// await timer.wait(${time}, 3)
// await motor.stop()
// `;
// };
pythonGenerator.forBlock["robot_rotate_left_ms"] = function (block) {
  const time = block.getFieldValue("TIME") || "500";

  return `await motor.rotate_left(80, 3)
await timer.wait(${time}, 3)
await motor.stop()
`;
};

// pythonGenerator.forBlock["robot_rotate_right_ms"] = function (block) {
//   const time = pythonGenerator.valueToCode(block, "TIME", 3) || "500";

//   return `await motor.rotate_right(80, 3)
// await timer.wait(${time}, 3)
// await motor.stop()
// `;
// };

pythonGenerator.forBlock["robot_rotate_right_ms"] = function (block) {
  const time = block.getFieldValue("TIME") || "500";

  return `await motor.rotate_right(80, 3)
await timer.wait(${time}, 3)
await motor.stop()
`;
};

pythonGenerator.forBlock["robot_delay"] = function (block) {
  const time = pythonGenerator.valueToCode(block, "TIME", 3) || "1000";

  return `await timer.wait(${time}, 3)\n`;
};

pythonGenerator.forBlock["GetButtonOnboard"] = function () {
  return [`await board.GetButtonOnboard(3)`, 3];
};


// Động cơ 1
pythonGenerator.forBlock["robot_motor_1"] = function (block) {
  const power =
    pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  return `await motor.set_power(0, ${power}, 3)\n`;
};

// Động cơ 2
pythonGenerator.forBlock["robot_motor_2"] = function (block) {
  const power =
    pythonGenerator.valueToCode(block, "POWER", 3) || "80";

  return `await motor.set_power(1, ${power}, 3)\n`;
};

// Điều khiển cả hai động cơ

pythonGenerator.forBlock["robot_motor_both"] = function (block) {
  const power1 = block.getFieldValue("POWER1") || "80";
  const power2 = block.getFieldValue("POWER2") || "80";

  const time = pythonGenerator.valueToCode(block, "TIME", 3) || "1";

  // Frontend: giây → milliseconds
  const timeMs = `(${time} * 1000)`;


  return (
    `await motor.set_power(0, ${power1}, 3)\n` +
    `await motor.set_power(1, ${power2}, 3)\n` +
    `await timer.wait(${timeMs}, 3)\n` +
    `await motor.stop()\n`
  );
};

