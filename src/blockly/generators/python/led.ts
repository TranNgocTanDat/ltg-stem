import { pythonGenerator } from "blockly/python";

/**
 * =========================================================
 * COLOR PICKER
 * =========================================================
 *
 * Ví dụ:
 *
 * Blockly:
 *   🔴 Đỏ
 *
 * Sinh ra:
 *   "0xff0000"
 */
pythonGenerator.forBlock["colorNumberPicker"] = function (
  block
) {
  const colour =
    block.getFieldValue("value") || "0xffffff";

  return [
    JSON.stringify(colour),
    0,
  ];
};

/**
 * =========================================================
 * LED SET ALL
 * =========================================================
 *
 * API:
 *
 * await pixel.set_colour(
 *   "0xff0000",
 *   None,
 *   3
 * )
 */
pythonGenerator.forBlock["led_set_all"] = function (
  block
) {
  const colour =
    pythonGenerator.valueToCode(
      block,
      "COLOUR",
      3
    ) || '"0xffffff"';

  return `await pixel.set_colour(${colour}, None, 3)\n`;
};

/**
 * =========================================================
 * LED SET SINGLE
 * =========================================================
 *
 * API:
 *
 * await pixel.set_colour(
 *   "0xff0000",
 *   0,
 *   3
 * )
 */
pythonGenerator.forBlock["led_set_single"] = function (
  block
) {
  const position =
    pythonGenerator.valueToCode(
      block,
      "POSITION",
      3
    ) || "0";

  const colour =
    pythonGenerator.valueToCode(
      block,
      "COLOUR",
      3
    ) || '"0xffffff"';

  return `await pixel.set_colour(${colour}, ${position}, 3)\n`;
};

/**
 * =========================================================
 * LED OFF
 * =========================================================
 */
pythonGenerator.forBlock["led_off"] = function () {
  return `await pixel.set_colour("0x000000", None, 3)\n`;
};

/**
 * =========================================================
 * LED WIPE
 * =========================================================
 *
 * API:
 *
 * await pixel.set_wipe(
 *   "0xff0000",
 *   100,
 *   3
 * )
 */
pythonGenerator.forBlock["led_wipe"] = function (
  block
) {
  const colour =
    pythonGenerator.valueToCode(
      block,
      "COLOUR",
      3
    ) || '"0xff0000"';

  const speed =
    pythonGenerator.valueToCode(
      block,
      "SPEED",
      3
    ) || "100";

  return `await pixel.set_wipe(${colour}, ${speed}, 3)\n`;
};