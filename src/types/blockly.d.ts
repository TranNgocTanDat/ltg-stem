import "blockly";

declare module "blockly" {
  interface BlocklyOptions {
    flyoutOptions?: {
      scrollbar?: boolean;
    };
  }

  export function registerToolboxCategoryCallback(arg0: string, arg1: (workspace: any) => Element[] & FlyoutItemInfo[]) {
    throw new Error("Function not implemented.");
  }
}
