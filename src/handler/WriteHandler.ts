import { handlers } from "@/blockly/protocol/HandlerRegistry";

handlers.on("uc.write", packet => {

    console.log("WRITE");

    console.log(packet);

    console.log("Data");

    console.log(packet.data);

    console.log("Is Uint8Array");

    console.log(packet.data instanceof Uint8Array);

    console.log("Length");

    console.log(packet.data?.length);

});