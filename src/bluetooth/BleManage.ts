import { BleEvents } from "./BleEvents";
import { BLE_EVENTS } from "./constants";
import type { BleConfig } from "./types";
import { AckManager } from "./AckManager";

import { ChunkDecoder } from "@/blockly/protocol/ChunkDecoder";
import { MessagePack } from "@/blockly/protocol/MessagePack";
import { dispatcher } from "@/blockly/protocol/PacketDispatcher";
import { toast } from "sonner";

export class BleManager {
  private ack = new AckManager();
  private config: BleConfig;

  private device?: BluetoothDevice;

  private server?: BluetoothRemoteGATTServer;

  private service?: BluetoothRemoteGATTService;

  private characteristic?: BluetoothRemoteGATTCharacteristic;

  private decoder = new ChunkDecoder();

  readonly events = new BleEvents();

  constructor(config: BleConfig) {
    this.config = config;
  }

  async connect() {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: this.config.filters || [],
        optionalServices: this.config.optionalServices,
      });

      this.server = await this.device.gatt!.connect();

      this.service = await this.server.getPrimaryService(
        this.config.serviceUUID,
      );

      this.characteristic = await this.service.getCharacteristic(
        this.config.characteristicUUID,
      );

      await this.characteristic.startNotifications();

      this.characteristic.addEventListener(
        "characteristicvaluechanged",
        this.handleNotify,
      );

      this.device.addEventListener(
        "gattserverdisconnected",
        this.handleDisconnect,
      );

      this.events.emit(BLE_EVENTS.CONNECTED);

      console.log("✅ BLE Connected");

      toast.success("Kết nối Não thành công!");
    } catch (error) {
      console.error("❌ BLE Connection failed:", error);

      // Nếu người dùng tự đóng cửa sổ chọn Bluetooth
      if (error instanceof DOMException && error.name === "NotFoundError") {
        return;
      }

      toast.error("Kết nối Não thất bại");

      throw error;
    }
  }

  disconnect() {
    this.characteristic?.removeEventListener(
      "characteristicvaluechanged",
      this.handleNotify,
    );

    this.device?.gatt?.disconnect();

    console.log("❌ BLE Disconnected");
  }

  isConnected() {
    return this.device?.gatt?.connected ?? false;
  }

  async write(data: Uint8Array) {
    // console.log("TX");

    // console.log(data);
    if (!this.characteristic) {
      throw new Error("BLE not connected");
    }

    await this.characteristic.writeValue(data as unknown as BufferSource);
  }

  async writeChunk(chunk: Uint8Array) {
    if (!this.characteristic) {
      throw new Error("BLE not connected");
    }

    // const flag = chunk[0];

    // console.log("TX", flag);

    // Đăng ký ACK trước
    const waitAck = this.ack.create();

    // Sau đó mới gửi
    await this.characteristic.writeValue(chunk as unknown as BufferSource);

    // Chờ ACK
    await waitAck;
  }

  private handleNotify = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;

    if (!characteristic.value) return;

    const bytes = new Uint8Array(characteristic.value.buffer);

    // console.log("RX length =", bytes.length);

    // console.log(bytes);

    if (bytes.length == 1) {
      // const flag = bytes[0];

      // console.log(
      //   "ACK",

      //   flag,
      // );

      this.ack.ack();

      return;
    }
    // console.log("RX length =", bytes.length);
    // console.log(bytes);
    this.events.emit(BLE_EVENTS.MESSAGE, bytes);
    const packetBytes = this.decoder.add(bytes);

    if (packetBytes) {
      // console.log("Decoded Bytes");
      // console.log(packetBytes);

      const packet = MessagePack.decode(packetBytes);

      // console.log("========= FULL DECODE =========");
      // console.dir(packet);
      // console.log(JSON.stringify(packet, null, 2));
      // console.log("===============================");

      dispatcher.dispatch(packet);
    }
  };

  private handleDisconnect = () => {
    this.events.emit(BLE_EVENTS.DISCONNECTED);

    console.log("BLE Device disconnected");
    toast.error("Não đã ngắt kết nối");
  };
}
