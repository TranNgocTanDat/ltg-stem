import { handlers } from "@/blockly/protocol/HandlerRegistry";

handlers.on("ucmd",packet=>{

    console.log("UCMD");

    console.log(packet);

});