import { pythonGenerator } from "blockly/python";

const COLOR_MAP: Record<string, [number, number, number]> = {
  RED: [255, 0, 0],
  GREEN: [0, 255, 0],
  BLUE: [0, 0, 255],
  YELLOW: [255, 255, 0],
  PURPLE: [128, 0, 128],
  CYAN: [0, 255, 255],
  WHITE: [255, 255, 255],
};

pythonGenerator.forBlock["rgb_led_set"] = function (block) {
  const port = block.getFieldValue("PORT");
  const index = block.getFieldValue("INDEX");
  const color = block.getFieldValue("COLOR");

  const [r, g, b] = COLOR_MAP[color] || [0, 0, 0];

  if (index === "ALL") {
    return `rgb_set("${port}", ${r}, ${g}, ${b})\n`;
  }

  return `rgb_set("${port}", ${index}, ${r}, ${g}, ${b})\n`;
};
