// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (packet: any) => void;

export class HandlerRegistry {

    private handlers = new Map<
        string,
        Set<Handler>
    >();

    on(event: string, handler: Handler) {

        let list = this.handlers.get(event);

        if (!list) {

            list = new Set();

            this.handlers.set(event, list);

        }

        list.add(handler);

    }

    off(event: string, handler: Handler) {

        this.handlers.get(event)?.delete(handler);

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(packet: any) {

        if (!packet?.event) return;

        // console.log("HANDLER", packet.event);

        const list = this.handlers.get(packet.event);

        if (!list) return;

        for (const fn of list) {

            fn(packet);

        }

    }

}

export const handlers = new HandlerRegistry();