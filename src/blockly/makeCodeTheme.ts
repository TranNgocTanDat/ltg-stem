// src/blockly/makeCodeTheme.ts
import * as Blockly from "blockly";

export const makeCodeTheme = Blockly.Theme.defineTheme("makecode", {
    base: Blockly.Themes.Classic,

    blockStyles: {
        logic_blocks: {
            colourPrimary: "#5C81A6",
        },
        math_blocks: {
            colourPrimary: "#5CA65C",
        },
    },

    componentStyles: {
        workspaceBackgroundColour: "#f3f3f3",
        flyoutBackgroundColour: "#f8f9fa",
        scrollbarColour: "#c1c1c1",
    },
    name: ""
});
