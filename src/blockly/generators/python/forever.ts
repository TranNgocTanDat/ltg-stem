import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";
/* =========================
 * 🔁 FOREVER
 * ========================= */

pythonGenerator.forBlock["forever"] = function (block) {
  const handler = pythonGenerator.statementToCode(block, "HANDLER");

  return handler;
};

pythonGenerator.forBlock["controls_repeat_ext"] = function (
  block: Blockly.Block,
) {
  const times = pythonGenerator.valueToCode(block, "TIMES", 3) || "0";

  const statements = pythonGenerator.statementToCode(block, "DO");

  if (!statements.trim()) {
    return `for i in range(${times}):\n    pass\n`;
  }

  return `for i in range(${times}):\n${statements}`;
};

pythonGenerator.forBlock["controls_whileUntil"] = function (
  block: Blockly.Block,
) {
  const condition = pythonGenerator.valueToCode(block, "COND", 0) || "False";

  const statements = pythonGenerator.statementToCode(block, "DO");

  return `while ${condition}:
    await uasyncio.sleep_ms(0)
${statements || "    pass"}
`;
};
pythonGenerator.forBlock["wait_until"] = function (block: Blockly.Block) {
  const condition = pythonGenerator.valueToCode(block, "COND", 0) || "False";

  return `while True:
    await uasyncio.sleep_ms(0)
    if (${condition}):
        break
`;
};

pythonGenerator.forBlock["pxt_controls_for"] = function (block: Blockly.Block) {
  const to = pythonGenerator.valueToCode(block, "TO", 0) || "0";

  const statements = pythonGenerator.statementToCode(block, "DO");

  return `for usr_index in range(${to}):
${statements || "    pass"}
`;
};
