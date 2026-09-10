import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/**
 * =========================================================
 * LOGIC COMPARE
 * =========================================================
 */

pythonGenerator.forBlock["logic_compare"] = function (
  block: Blockly.Block
) {
  const op =
    block.getFieldValue("OP") || "EQ";

  const a =
    pythonGenerator.valueToCode(
      block,
      "A",
      3
    ) || "0";

  const b =
    pythonGenerator.valueToCode(
      block,
      "B",
      3
    ) || "0";

  let operator = "==";

  switch (op) {
    case "EQ":
      operator = "==";
      break;

    case "NEQ":
      operator = "!=";
      break;

    case "LT":
      operator = "<";
      break;

    case "LTE":
      operator = "<=";
      break;

    case "GT":
      operator = ">";
      break;

    case "GTE":
      operator = ">=";
      break;
  }

  return [
    `(${a} ${operator} ${b})`,
    0,
  ];
};


/**
 * =========================================================
 * LOGIC OPERATION
 * =========================================================
 *
 * AND -> logic.all()
 * OR  -> logic.any()
 */

pythonGenerator.forBlock["logic_operation"] = function (
  block: Blockly.Block
) {
  const op =
    block.getFieldValue("OP") || '"AND"';

  const a =
    pythonGenerator.valueToCode(
      block,
      "A",
      3
    ) || "False";

  const b =
    pythonGenerator.valueToCode(
      block,
      "B",
      3
    ) || "False";

  if (op === '"AND"') {
    return `await logic.all(${a}, ${b}, 3)`;
  }

  return `await logic.any(${a}, ${b}, 3)`;
};


/**
 * =========================================================
 * LOGIC BOOLEAN
 * =========================================================
 */

pythonGenerator.forBlock["logic_boolean"] = function (
  block: Blockly.Block
) {
  const bool =
    block.getFieldValue("BOOL") || "FALSE";

  return [
    bool === "TRUE"
      ? "True"
      : "False",
    0,
  ];
};


/**
 * =========================================================
 * LOGIC NEGATE
 * =========================================================
 */

pythonGenerator.forBlock["logic_negate"] = function (
  block: Blockly.Block
) {
  const bool =
    pythonGenerator.valueToCode(
      block,
      "BOOL",
      3
    ) || "False";

  return [
    `not (${bool})`,
    0,
  ];
};


/**
 * =========================================================
 * GET BUTTON ONBOARD
 * =========================================================
 */

pythonGenerator.forBlock["GetButtonOnboard"] =
  function () {
    return [
      "await board.GetButtonOnboard(3)",
      0,
    ];
  };