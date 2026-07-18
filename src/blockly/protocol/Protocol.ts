import { ble } from "@/bluetooth";

import { Chunk } from "./Chunk";

import { MessagePack } from "./MessagePack";
import { mailbox } from "./MailboxSingleton";

export class Protocol {
  private mtu = 244;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(obj: any) {
    console.log("SEND");

    console.dir(obj);

    console.log(JSON.stringify(obj, null, 2));

    const encoded = MessagePack.encode(obj);

    console.log("ENCODED");
    console.log(encoded);

    const chunks = Chunk.encode(encoded, this.mtu);

    console.log("CHUNKS");
    console.log(chunks);

    for (const chunk of chunks) {
      await ble.writeChunk(chunk);
    }
  }

  async handshake() {
    const uuid = "#" + crypto.randomUUID().slice(0, 7);

    const pkg = {
      uuid,

      event: "gb.handshake",

      data: {
        internet: true,

        makecode: "ltg-web",
      },
    };

    console.log("Handshake", pkg);

    await this.send(pkg);
    const response = await mailbox.wait(uuid);

    console.log("Handshake Response");

    console.log(response);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(obj: any) {
    await this.send(obj);

    if (!obj.uuid) return;

    return mailbox.wait(obj.uuid);
  }
}
