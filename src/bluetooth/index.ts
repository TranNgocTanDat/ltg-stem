
import { BleManager } from "./BleManage";
import { Grobot6610Config } from "./configs/grobot6610";

export const ble = new BleManager(
  Grobot6610Config
);

export * from "./constants";