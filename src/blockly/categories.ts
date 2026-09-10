import type { FlyoutItem } from "./blocklyTypes";
import {
  CarFront,
  ChartSpline,
  GitBranch,
  Home,
  Lightbulb,
  List,
  Repeat,
  Sigma,
  Type,
  Variable,
  Volume2,
  type LucideIcon,
} from "lucide-react";

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

      // { kind: "sep", gap: 16 },
      // { kind: "block", type: "text_print" },
      {
        kind: "block",
        type: "robot_delay",
        inputs: {
          TIME: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1000,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "distance_sensor_read",
      },
      {
        kind: "block",
        type: "distance_sensor_detect",
      },
    ],
  },
  {
    id: "device",
    name: "Động cơ",
    color: "#E67E22",
    icon: CarFront,
    contents: [
      // { kind: "label", text: "LED RGB" },
      // { kind: "block", type: "rgb_led_set" },

      // { kind: "sep", gap: 16 },

      { kind: "label", text: "Động cơ" },

      {
        kind: "block",
        type: "robot_forward",
        inputs: {
          POWER: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 80,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "robot_forward_ms",
        inputs: {
          POWER: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 80,
              },
            },
          },
          TIME: {
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
        type: "robot_backward",
        inputs: {
          POWER: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 80,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "robot_backward_ms",
        inputs: {
          POWER: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 80,
              },
            },
          },
          TIME: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
      { kind: "block", type: "robot_stop" },
      {
        kind: "block",
        type: "robot_rotate_left_ms",
        inputs: {
          TIME: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 500,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "robot_rotate_right_ms",
        inputs: {
          TIME: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 500,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "robot_rotate_left",
        inputs: {
          POWER: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 80,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "robot_rotate_right",
        inputs: {
          POWER: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 80,
              },
            },
          },
        },
      },
      // {
      //   kind: "block",
      //   type: "robot_turn_left",
      //   inputs: {
      //     POWER: {
      //       shadow: {
      //         type: "math_number",
      //         fields: {
      //           NUM: 80,
      //         },
      //       },
      //     },
      //   },
      // },
    ],
  },

  {
    id: "buzzer",
    name: "Âm thanh",
    color: "#F59E0B",
    icon: Volume2,

    contents: [
      {
        kind: "block",
        type: "buzzer_set",
      },

      {
        kind: "block",
        type: "buzzer_set_bpm",
        inputs: {
          BPM: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 120,
              },
            },
          },
        },
      },

      {
        kind: "block",
        type: "buzzer_play_tone",
        inputs: {
          FREQ: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 440,
              },
            },
          },

          TIME: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 500,
              },
            },
          },
        },
      },

      {
        kind: "block",
        type: "buzzer_play_note",
        inputs: {
          NOTE: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 440,
              },
            },
          },

          TIME: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 500,
              },
            },
          },
        },
      },

      {
        kind: "block",
        type: "buzzer_play_song",
      },

      {
        kind: "block",
        type: "buzzer_play_basic",
      },

      {
        kind: "block",
        type: "buzzer_play_note_",
        inputs: {
          SEMI: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 60,
              },
            },
          },

          BEAT: {
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
        type: "buzzer_mute",
      },
    ],
  },
  {
    id: "led",
    name: "Đèn LED",
    icon: Lightbulb,
    color: "#E91E63",

    contents: [
      {
        kind: "block",
        type: "led_set_all",

        inputs: {
          COLOUR: {
            shadow: {
              type: "colorNumberPicker",
              fields: {
                value: "0xff0000",
              },
            },
          },
        },
      },

      {
        kind: "block",
        type: "led_set_single",

        inputs: {
          POSITION: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0,
              },
            },
          },

          COLOUR: {
            shadow: {
              type: "colorNumberPicker",
              fields: {
                value: "0xff0000",
              },
            },
          },
        },
      },

      {
        kind: "block",
        type: "led_off",
      },

      {
        kind: "block",
        type: "led_wipe",

        inputs: {
          COLOUR: {
            shadow: {
              type: "colorNumberPicker",
              fields: {
                value: "0xff0000",
              },
            },
          },

          SPEED: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
    ],
  },
  {
    id: "logic",
    name: "Logic",
    color: "#3ba1c5",
    icon: GitBranch,
    contents: [
      // IF / ELSE
      {
        kind: "block",
        type: "controls_if",
        inputs: {
          IF0: {
            shadow: {
              type: "logic_boolean",
              fields: {
                BOOL: "TRUE",
              },
            },
          },
        },
      },

      // SO SÁNH
      {
        kind: "block",
        type: "logic_compare",
        inputs: {
          A: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0,
              },
            },
          },
          B: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 0,
              },
            },
          },
        },
      },

      // AND / OR
      {
        kind: "block",
        type: "logic_operation",
      },

      // TRUE / FALSE
      {
        kind: "block",
        type: "logic_boolean",
      },

      // NOT
      {
        kind: "block",
        type: "logic_negate",
        inputs: {
          BOOL: {
            shadow: {
              type: "logic_boolean",
              fields: {
                BOOL: "TRUE",
              },
            },
          },
        },
      },

      // BUTTON
      {
        kind: "block",
        type: "GetButtonOnboard",
      },
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
      {
        kind: "block",
        type: "controls_repeat_ext",
        inputs: {
          TIMES: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: 4,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "controls_whileUntil",
      },
      {
        kind: "block",
        type: "wait_until",
      },
      {
        kind: "block",
        type: "pxt_controls_for",
      },
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
];
