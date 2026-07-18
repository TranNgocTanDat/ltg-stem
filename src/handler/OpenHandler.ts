import { handlers } from "@/blockly/protocol/HandlerRegistry";

handlers.on("uc.open",packet=>{

    console.log("OPEN");

    console.log(packet);

});