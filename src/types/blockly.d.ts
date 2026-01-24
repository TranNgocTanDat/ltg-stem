import "blockly";

declare module "blockly" {
  interface BlocklyOptions {
    flyoutOptions?: {
      scrollbar?: boolean;
    };
  }
}
