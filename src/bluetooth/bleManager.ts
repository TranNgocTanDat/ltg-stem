/// <reference lib="dom" />
/// <reference types="web-bluetooth" />

/* ================= UUID ================= */

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const RX_UUID = "abcd1234-1234-1234-1234-abcdef123456"; // web -> esp32
const TX_UUID = "abcd5678-1234-1234-1234-abcdef654321"; // esp32 -> web

/* ================= BLE MANAGER ================= */

class BleManager {
  private device: BluetoothDevice | null = null;
  private rxChar: BluetoothRemoteGATTCharacteristic | null = null;
  private txChar: BluetoothRemoteGATTCharacteristic | null = null;

  // 🔹 queue để tránh "GATT operation already in progress"
  private queue: Uint8Array[] = [];
  private sending = false;

  /* ================= CONNECT ================= */

  async connect() {
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "ESP32" }],
      optionalServices: [SERVICE_UUID],
    });

    const server = await this.device.gatt!.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);

    this.rxChar = await service.getCharacteristic(RX_UUID);
    this.txChar = await service.getCharacteristic(TX_UUID);

    await this.txChar.startNotifications();
    this.txChar.addEventListener(
      "characteristicvaluechanged",
      this.onNotify,
    );

    console.log("✅ BLE connected");
  }

  disconnect() {
    if (!this.device) return;

    if (this.txChar) {
      this.txChar.removeEventListener(
        "characteristicvaluechanged",
        this.onNotify,
      );
    }

    if (this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }

    this.device = null;
    this.rxChar = null;
    this.txChar = null;
    this.queue = [];
    this.sending = false;

    console.log("❌ BLE disconnected");
  }

  /* ================= RECEIVE ================= */

  private onNotify = (e: Event) => {
    const char = e.target as BluetoothRemoteGATTCharacteristic;
    const value = new TextDecoder().decode(char.value!);
    console.log("📥 ESP32:", value);
  };

  /* ================= SEND ================= */

  async send(msg: unknown) {
    if (!this.rxChar) throw new Error("BLE not connected");

    // 1️⃣ stringify
    const text = typeof msg === "string" ? msg : JSON.stringify(msg);
    const framed = text.endsWith("\n") ? text : text + "\n";

    // 2️⃣ encode (Uint8Array)
    const encoded = new TextEncoder().encode(framed);

    // ⚠️ tạo bản sao để tránh typing ArrayBufferLike
    const data = new Uint8Array(encoded);

    // 3️⃣ push queue
    this.queue.push(data);
    this.processQueue();
  }

  private async processQueue() {
    if (this.sending) return;
    if (!this.rxChar) return;

    this.sending = true;

    try {
      while (this.queue.length > 0) {
        const data = this.queue.shift()!;

        // ✅ FIX QUAN TRỌNG: ép về ArrayBuffer
        await this.rxChar.writeValue(
          data.buffer as ArrayBuffer
        );

        console.debug(
          "➡️ BLE SEND:",
          new TextDecoder().decode(data),
        );

        // delay nhỏ để BLE không nghẽn
        await this.sleep(20);
      }
    } catch (e) {
      console.error("❌ BLE send error", e);
    } finally {
      this.sending = false;
    }
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) =>
      setTimeout(resolve, ms),
    );
  }
}

/* ================= EXPORT ================= */

export const ble = new BleManager();
