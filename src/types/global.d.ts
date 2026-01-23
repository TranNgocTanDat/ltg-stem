import type { BleManager } from "../ble/bleManager";

declare global {
  interface Window {
    ble: BleManager;
  }
}

export {};
