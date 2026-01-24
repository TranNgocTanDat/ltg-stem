export type FlyoutItem =
  | {
      kind: "block";
      type: string;
    }
  | {
      kind: "label";
      text: string;
    }
  | {
      kind: "sep";
      gap?: number;
    };
