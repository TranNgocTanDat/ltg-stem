import { protocol } from "@/blockly/protocol";
import { ble } from "@/bluetooth";

export class UploadService {
  async upload(code: string) {
    console.log("UPLOAD START");
    // Kiểm tra Bluetooth trước khi bắt đầu nạp
    if (!ble.isConnected()) {
      throw new Error("BLE_NOT_CONNECTED");
    }

    await this.enterUploadMode();

    await this.sendMetadata();

    await this.open();

    await this.write(code);

    await this.close();

    await this.start();

    console.log("UPLOAD DONE");
  }

  async stop() {
    console.log("STOP START");

    await protocol.send({
      event: "deinit",
    });

    console.log("STOP DONE");
  }

  private async enterUploadMode() {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);
    // const res =
    await protocol.request({
      uuid,

      event: "ucmd",

      data: {
        slot: 0,
      },
    });

    // console.log(res);
  }

  private async sendMetadata() {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);

    await protocol.send({
      uuid,
      event: "ucum",

      data: {
        slot: 0,

        flag: {
          priority_program: false,

          GetButtonOnboard: false,

          network_wifi_setconnect: false,

          network_wifi_used: 0,

          slot: 0,

          wifi: {},
        },

        hashcode: {},

        hashlink: null,
      },
    });
  }

  private async open() {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);

    await protocol.send({
      uuid,

      event: "uc.open",

      data: {
        slot: 0,
      },
    });
  }

  private async write(code: string) {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);

    const CHUNK = 256;

    for (let i = 0; i < code.length; i += CHUNK) {
      const chunk = code.slice(i, i + CHUNK);

      await protocol.send({
        uuid,

        event: "uc.write",

        data: {
          chunk,
        },
      });
    }
  }

  private async close() {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);

    await protocol.send({
      uuid,

      event: "uc.close",
    });
  }

  private async start() {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);

    await protocol.send({
      uuid,

      event: "uc.start",

      data: {
        slot: 0,
      },
    });
  }
}

export const uploader = new UploadService();
