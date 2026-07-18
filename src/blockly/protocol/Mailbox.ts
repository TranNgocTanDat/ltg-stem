export class Mailbox {

    private packets = new Map<string, unknown>();

    private waiting = new Map<
        string,
        (value: unknown)=>void
    >();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    push(packet:any){

        if(!packet.uuid) return;

        const resolver = this.waiting.get(packet.uuid);

        if(resolver){

            resolver(packet);

            this.waiting.delete(packet.uuid);

            return;
        }

        this.packets.set(packet.uuid,packet);

    }

    async wait(uuid:string){

        const old = this.packets.get(uuid);

        if(old){

            this.packets.delete(uuid);

            return old;

        }

        return new Promise(resolve=>{

            this.waiting.set(uuid,resolve);

        });

    }

}