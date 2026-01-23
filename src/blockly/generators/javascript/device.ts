import { javascriptGenerator } from "blockly/javascript";

const COLORS: Record<string, [number, number, number]> = {
  RED: [255, 0, 0],
  GREEN: [0, 255, 0],
  BLUE: [0, 0, 255],
  YELLOW: [255, 255, 0],
  PURPLE: [128, 0, 128],
  CYAN: [0, 255, 255],
  WHITE: [255, 255, 255],
};

javascriptGenerator.forBlock["rgb_led_set"] = function (block) {
  const port = block.getFieldValue("PORT");
  const index = block.getFieldValue("INDEX");
  const color = block.getFieldValue("COLOR");

  const [r, g, b] = COLORS[color] || [0, 0, 0];

  let args = `
    port: "${port}",
    r: ${r},
    g: ${g},
    b: ${b}
  `;

  // ✅ CHỈ gửi index nếu KHÔNG phải ALL
  if (index !== "ALL") {
    args += `,\n    index: ${Number(index)}`;
  }

  return `
ble.send({
  cmd: "rgb",
  args: {
${args}
  }
});
`;
};
