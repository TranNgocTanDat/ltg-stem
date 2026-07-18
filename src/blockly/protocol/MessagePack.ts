import { encode, decode } from "@msgpack/msgpack";

export class MessagePack {

    static encode(obj: unknown): Uint8Array {

        return new Uint8Array(

            encode(obj)

        );

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static decode(bytes: Uint8Array): any {

        return decode(bytes);

    }

}