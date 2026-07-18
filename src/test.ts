import { Chunk } from "./blockly/protocol/Chunk";
import { MessagePack } from "./blockly/protocol/MessagePack";

const bytes = MessagePack.encode({
    event: "ping",
    hello: "world",
});

console.log(bytes);

console.log(
    MessagePack.decode(bytes)
);

const packets = Chunk.encode(
    new Uint8Array(600),
    244
);



console.log(packets);