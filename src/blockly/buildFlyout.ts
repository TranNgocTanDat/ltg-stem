import type { FlyoutItem } from "./blocklyTypes";

export function buildFlyout(contents: FlyoutItem[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toolboxContents: any[] = [];

  for (const item of contents) {
    if (item.kind === "block") {
      toolboxContents.push({
        kind: "block",
        type: item.type,
      });
    }

    if (item.kind === "label") {
      toolboxContents.push({
        kind: "label",
        text: item.text,
      });
    }

    if (item.kind === "sep") {
      toolboxContents.push({
        kind: "sep",
        gap: item.gap ?? 12,
      });
    }
  }

  return {
    kind: "flyoutToolbox",
    contents: toolboxContents,
  } as const;
}
