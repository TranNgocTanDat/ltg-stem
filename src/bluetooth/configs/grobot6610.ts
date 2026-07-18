import type { BleConfig } from "../types";

export const Grobot6610Config: BleConfig = {
  filters: [
    {
      namePrefix: "Grobot",
    },
    {
      namePrefix: "LTGedu",
    },
  ],

  optionalServices: [
    "0000ffe0-0000-1000-8000-00805f9b34fb",
  ],

  serviceUUID:
    "0000ffe0-0000-1000-8000-00805f9b34fb",

  characteristicUUID:
    "0000ffe1-0000-1000-8000-00805f9b34fb",
};