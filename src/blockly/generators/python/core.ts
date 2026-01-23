import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/* =========================
 * 🟢 ON START
 * ========================= */
pythonGenerator.forBlock["on_start"] = function (
  block: Blockly.Block
) {
  const body =
    pythonGenerator.statementToCode(block, "DO");

  return `
def on_start():
${body || "    pass"}

on_start()
`;
};

/* =========================
 * 🔁 FOREVER
 * ========================= */
pythonGenerator.forBlock["forever"] = function (
  block: Blockly.Block
) {
  const body =
    pythonGenerator.statementToCode(block, "DO");

  return `
while True:
${body || "    pass"}
`;
};

/* =========================
 * ⏱ WAIT (ms)
 * ========================= */
pythonGenerator.forBlock["wait_ms"] = function (
  block: Blockly.Block
) {
  const ms =
    pythonGenerator.valueToCode(
      block,
      "TIME",
      0
    ) || "0";

  return `sleep_ms(${ms})\n`;
};
