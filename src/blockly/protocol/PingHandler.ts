import { handlers } from "./HandlerRegistry";

handlers.on(
    "instance.ping",
    packet=>{

        console.log("PING");

        console.log(packet);

    }
);