// src/blockly/categories.ts
// src/blockly/categories.ts
import type { FlyoutItem } from "./blocklyTypes";

export type Category = {
  id: string;
  name: string;
  color: string;
  contents: FlyoutItem[];
};

export const CATEGORIES: Category[] = [
  {
    id: "basic",
    name: "CƠ BẢN",
    color: "#A65CA6",
    contents: [
      { kind: "block", type: "on_start" },
      { kind: "block", type: "forever" },
      { kind: "block", type: "wait_ms" },
      { kind: "label", text: "Giá trị" },
      { kind: "block", type: "math_number" },
      { kind: "block", type: "text" },

      { kind: "sep", gap: 16 },

      { kind: "label", text: "Hiển thị" },
      { kind: "block", type: "text_print" },

      { kind: "sep", gap: 16 },

      { kind: "label", text: "Điều khiển" },
      { kind: "block", type: "controls_repeat_ext" },
      { kind: "block", type: "controls_if" },
      { kind: "block", type: "logic_compare" },
      { kind: "block", type: "math_arithmetic" },
    ],
  },

  {
    id: "logic",
    name: "Logic",
    color: "#5C81A6",
    contents: [
      { kind: "block", type: "controls_if" },
      { kind: "block", type: "controls_ifelse" },
      { kind: "block", type: "logic_compare" },
      { kind: "block", type: "logic_operation" },
      { kind: "block", type: "logic_boolean" },
      { kind: "block", type: "logic_negate" },
    ],
  },
  {
    id: "math",
    name: "Toán",
    color: "#5CA65C",
    contents: [
      { kind: "block", type: "math_number" },
      { kind: "block", type: "math_arithmetic" },
      { kind: "block", type: "math_single" },
      { kind: "block", type: "math_trig" },
      { kind: "block", type: "math_constant" },
      { kind: "block", type: "math_number_property" },
      { kind: "block", type: "math_round" },
      { kind: "block", type: "math_on_list" },
      { kind: "block", type: "math_modulo" },
      { kind: "block", type: "math_constrain" },
      { kind: "block", type: "math_random_int" },
      { kind: "block", type: "math_random_float" },
      { kind: "block", type: "math_atan2" },
    ],
  },
  {
    id: "loop",
    name: "Vòng lặp",
    color: "#A65C81",
    contents: [
      { kind: "block", type: "controls_repeat_ext" },
      { kind: "block", type: "controls_whileUntil" },
    ],
  },
  {
    id: "text",
    name: "Text",
    color: "#A6815C",
    contents: [
      { kind: "block", type: "text" },
      { kind: "block", type: "text_print" },
    ],
  },
  {
    id: "device",
    name: "Thiết bị",
    color: "#E67E22",
    contents: [
      { kind: "label", text: "LED RGB" },
      { kind: "block", type: "rgb_led_set" },
    ],
  },
];
