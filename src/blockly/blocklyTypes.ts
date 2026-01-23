export type FlyoutBlockItem = {
  kind: "block";
  type: string;
};

export type FlyoutSeparatorItem = {
  kind: "sep";
  gap?: number;
};

export type FlyoutLabelItem = {
  kind: "label";
  text: string;
};

export type FlyoutButtonItem = {
  kind: "button";
  text: string;
  callbackKey: string;
};

export type FlyoutItem =
  | FlyoutBlockItem
  | FlyoutSeparatorItem
  | FlyoutLabelItem
  | FlyoutButtonItem;
