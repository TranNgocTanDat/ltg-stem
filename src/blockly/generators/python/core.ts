import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/* =========================
 * 🟢 ON START
 * ========================= */
pythonGenerator.forBlock["on_start"] = function (block: Blockly.Block) {
  return pythonGenerator.statementToCode(block, "DO");
};

/* =========================
 * 🔁 FOREVER
 * ========================= */

pythonGenerator.forBlock["forever"] = function (block) {
  const handler =
    pythonGenerator.statementToCode(block, "HANDLER");

  return handler;
};
/* =========================
 * ⏱ WAIT (ms)
 * ========================= */
pythonGenerator.forBlock["wait_ms"] = function (block: Blockly.Block) {
  const ms = pythonGenerator.valueToCode(block, "TIME", 0) || "0";

  return `sleep_ms(${ms})\n`;
};
