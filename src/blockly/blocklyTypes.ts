  export type FlyoutItem =
    | {
        kind: "block";
        type: string;

        // dùng cho value input (lists_repeat, lists_split, ...)
        inputs?: {
          [inputName: string]: {
            shadow?: {
              type: string;
              fields?: {
                [fieldName: string]: string | number | boolean;
              };
            };
            block?: {
              type: string;
              fields?: {
                [fieldName: string]: string | number | boolean;
              };
            };
          };
        };

        // dùng cho field trực tiếp trên block
        fields?: {
          [fieldName: string]: string | number | boolean;
        };

        // ⭐ RẤT QUAN TRỌNG: dùng cho mutation (lists_create_with, controls_if, ...)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extraState?: Record<string, any>;
      }
    | {
        kind: "label";
        text: string;
      }
    | {
        kind: "sep";
        gap?: number;
      };
