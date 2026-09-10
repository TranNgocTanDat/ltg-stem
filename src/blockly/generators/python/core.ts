import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/* =========================
 * 🟢 ON START
 * ========================= */
pythonGenerator.forBlock["on_start"] = function (block: Blockly.Block) {
  return pythonGenerator.statementToCode(block, "DO");
};

/* =========================
 * ⏱ WAIT (ms)
 * ========================= */
pythonGenerator.forBlock["wait_ms"] = function (block: Blockly.Block) {
  const ms = pythonGenerator.valueToCode(block, "TIME", 0) || "0";

  return `sleep_ms(${ms})\n`;
};

pythonGenerator.forBlock["controls_if"] = function (block: Blockly.Block) {
  let code = "";

  // =========================
  // IF
  // =========================
  const condition = pythonGenerator.valueToCode(block, "IF0", 0) || "False";

  const statements = pythonGenerator.statementToCode(block, "DO0");

  code += `if (${condition}):\n`;
  code += statements || "    pass\n";

  // =========================
  // ELSE IF
  // =========================
  for (let i = 1; i < 64; i++) {
    // Quan trọng: kiểm tra input tồn tại trước
    if (!block.getInput(`IF${i}`)) {
      continue;
    }

    const condition = pythonGenerator.valueToCode(block, `IF${i}`, 0);

    if (!condition) continue;

    const statements = pythonGenerator.statementToCode(block, `DO${i}`);

    code += `elif (${condition}):\n`;
    code += statements || "    pass\n";
  }

  // =========================
  // ELSE
  // =========================
  if (block.getInput("ELSE")) {
    const elseCode = pythonGenerator.statementToCode(block, "ELSE");

    if (elseCode) {
      code += `else:\n`;
      code += elseCode;
    }
  }

  return code;
};
