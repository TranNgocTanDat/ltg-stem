import { handlers } from "@/blockly/protocol/HandlerRegistry";

handlers.on("uc.start",packet=>{

    console.log("START");

    console.log(packet);

});