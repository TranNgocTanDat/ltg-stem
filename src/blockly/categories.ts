import type { FlyoutItem } from "./blocklyTypes";
import { ChartSpline, GitBranch, Home, List, Repeat, Sigma, Type, Variable, type LucideIcon } from "lucide-react";

export const CATEGORIES: {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  contents: FlyoutItem[];
}[] = [
  {
    id: "basic",
    name: "Cơ bản",
    color: "#134b5f",
    icon: Home,
    contents: [
      { kind: "block", type: "on_start" },
      { kind: "block", type: "forever" },
      { kind: "block", type: "wait_ms" },

      { kind: "sep", gap: 16 },
      { kind: "block", type: "text_print" },
    ],
  },

  {
    id: "logic",
    name: "Logic",
    color: "#3ba1c5",
    icon: GitBranch,
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
    icon: Sigma,
    contents: [
      {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: 123,
        },
      },
      {
        kind: "block",
        type: "math_arithmetic",
        inputs: {
          A: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          B: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_single",
        inputs: {
          NUM: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 9,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_trig",
        inputs: {
          NUM: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 45,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_constant",
      },
      {
        kind: "block",
        type: "math_number_property",
        inputs: {
          NUMBER_TO_CHECK: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_round",
        fields: {
          OP: "ROUND",
        },
        inputs: {
          NUM: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 3.1,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_on_list",
        fields: {
          OP: "SUM",
        },
      },
      {
        kind: "block",
        type: "math_modulo",
        inputs: {
          DIVIDEND: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 64,
              },
            },
          },
          DIVISOR: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 10,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_constrain",
        inputs: {
          VALUE: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 50,
              },
            },
          },
          LOW: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          HIGH: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_random_int",
        inputs: {
          FROM: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          TO: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_random_float",
      },
      {
        kind: "block",
        type: "math_atan2",
        inputs: {
          X: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          Y: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
    ],
  },
  {
    id: "loop",
    name: "Vòng lặp",
    icon: Repeat,
    color: "#50cc74",
    contents: [
      { kind: "block", type: "controls_repeat_ext" },
      { kind: "block", type: "controls_whileUntil" },
    ],
  },
  {
    id: "text",
    name: "Văn bản",
    color: "#A6815C",
    icon: Type,
    contents: [
      {
        kind: "block",
        type: "text",
      },
      {
        kind: "block",
        type: "text_join",
      },
      {
        kind: "block",
        type: "text_append",
        inputs: {
          TEXT: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },
      { kind: "block", type: "text_print" },
      {
        kind: "block",
        type: "text_length",
        inputs: {
          VALUE: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_isEmpty",
        inputs: {
          VALUE: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_indexOf",
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
            },
          },
          FIND: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_charAt",
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_getSubstring",
        inputs: {
          STRING: {
            block: {
              type: "variables_get",
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_changeCase",
        inputs: {
          TEXT: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_trim",
        inputs: {
          TEXT: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_count",
        inputs: {
          SUB: {
            shadow: {
              type: "text",
            },
          },
          TEXT: {
            shadow: {
              type: "text",
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_replace",
        inputs: {
          FROM: {
            shadow: {
              type: "text",
            },
          },
          TO: {
            shadow: {
              type: "text",
            },
          },
          TEXT: {
            shadow: {
              type: "text",
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_reverse",
        inputs: {
          TEXT: {
            shadow: {
              type: "text",
            },
          },
        },
      },
    ],
  },
  {
    id: "lists",
    name: "Danh sách",
    color: "#745ba5",
    icon: List,
    contents: [
      {
        kind: "block",
        type: "lists_create_with",
        extraState: { itemCount: 3 },
      },
      {
        kind: "block",
        type: "lists_create_with",
        extraState: { itemCount: 3 },
      },
      {
        kind: "block",
        type: "lists_repeat",
        inputs: {
          ITEM: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc", // giá trị mặc định cho phần tử
              },
            },
          },
          NUM: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 5, // số lần lặp
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_length",
      },
      {
        kind: "block",
        type: "lists_isEmpty",
      },
      {
        kind: "block",
        type: "lists_indexOf",
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_getIndex",
        inputs: {
          VALUE: {
            block: {
              type: "variables_get",
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_setIndex",
        inputs: {
          LIST: {
            block: {
              type: "variables_get",
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_getSublist",
        inputs: {
          LIST: {
            block: {
              type: "variables_get",
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_split",
        inputs: {
          DELIM: {
            shadow: {
              type: "text",
              fields: {
                TEXT: ",",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_sort",
      },
      {
        kind: "block",
        type: "lists_reverse",
      },
    ],
  },
  {
    id: "variables",
    name: "Biến",
    color: "#a55b80",
    icon: Variable,
    contents: [],
  },
  {
    id: "functions",
    name: "Hàm",
    color: "#995ba5",
    icon: ChartSpline,
    contents: [],
  },
  {
    id: "device",
    name: "Thiết bị",
    color: "#E67E22",
    icon: Type,
    contents: [
      { kind: "label", text: "LED RGB" },
      { kind: "block", type: "rgb_led_set" },
    ],
  },
];
