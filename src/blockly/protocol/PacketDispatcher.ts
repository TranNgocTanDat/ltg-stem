import { handlers } from "./HandlerRegistry";
import { mailbox } from "./MailboxSingleton";


export class PacketDispatcher {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(packet: any) {
    console.log("PACKET");

    console.log(packet);

    if (packet.uuid) {
      mailbox.push(packet);
    }
    handlers.emit(packet);
  }
}

export const dispatcher = new PacketDispatcher();
