import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

pythonGenerator.forBlock["controls_if"] =
  function (block: Blockly.Block) {
    let code = "";

    // ==============================
    // IF
    // ==============================

    const condition =
      pythonGenerator.valueToCode(
        block,
        "IF0",
        3
      ) || "False";

    const statements =
      pythonGenerator.statementToCode(
        block,
        "DO0"
      );

    code += `if ${condition}:\n`;

    code +=
      statements || "    pass\n";

    // ==============================
    // ELSE IF
    // ==============================

    for (let i = 1; i < 64; i++) {
      if (!block.getInput(`IF${i}`)) {
        continue;
      }

      const condition =
        pythonGenerator.valueToCode(
          block,
          `IF${i}`,
          3
        );

      if (!condition) {
        continue;
      }

      const statements =
        pythonGenerator.statementToCode(
          block,
          `DO${i}`
        );

      code += `elif ${condition}:\n`;

      code +=
        statements || "    pass\n";
    }

    // ==============================
    // ELSE
    // ==============================

    if (block.getInput("ELSE")) {
      const elseCode =
        pythonGenerator.statementToCode(
          block,
          "ELSE"
        );

      code += `else:\n`;

      code +=
        elseCode || "    pass\n";
    }

    return code;
  };