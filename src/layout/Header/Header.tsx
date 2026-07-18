import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Bluetooth } from "lucide-react";

import logo from "@/assets/logoltg.png";

import { ble, BLE_EVENTS } from "@/bluetooth";
import { protocol } from "@/blockly/protocol";
// import { uploader } from "@/service/UploadService";



const Header = () => {
  const [bleConnected, setBleConnected] =
    useState(false);

  useEffect(() => {
    const offConnected = ble.events.on(
      BLE_EVENTS.CONNECTED,
      () => {
        setBleConnected(true);
      }
    );

    const offDisconnected = ble.events.on(
      BLE_EVENTS.DISCONNECTED,
      () => {
        setBleConnected(false);
      }
    );

    // const offMessage = ble.events.on<Uint8Array>(
    //   BLE_EVENTS.MESSAGE,
    //   (data) => {
    //     console.log("RX:", data);
    //   }
    // );

    return () => {
      offConnected();
      offDisconnected();
      // offMessage();
    };
  }, []);

  const connectBLE = async () => {
    try {
      await ble.connect();
      console.log("connected");

      await protocol.handshake();

      await protocol.send({

        event: "hello"

      });
    } catch (err) {
      console.error(err);
      alert("BLE connect failed");
    }
  };

  const disconnectBLE = () => {
    ble.disconnect();
  };

//   const handleUpload = async () => {

//     const code = `
// import coroutine
// import motor
// import uasyncio
// import gc;gc.collect()
// import interactive
// import board
// from constants import *
// import flag
// import usercode

// async def usercode_begin():
//     await motor.rotate_left(80,3)

// async def usercode_setup():
//     flag.remove(flag.PROGRAME_ONSTART)

// async def usercode_loop():
//     pass
// `;

// await uploader.upload(code);

//   };

  return (
    <header className="w-full h-16 bg-green-100 flex items-center px-4">
      <div className="flex justify-between w-full">
        <div className="w-1/2">
          <img
            src={logo}
            alt="Logo"
            className="h-10 object-contain"
          />
        </div>

        <div className="w-1/2 flex justify-start">
          <Button
            variant="outline"
            onClick={
              bleConnected
                ? disconnectBLE
                : connectBLE
            }
            className={
              bleConnected
                ? "bg-blue-500"
                : ""
            }
          >
            <Bluetooth />
          </Button>
          {/* <Button onClick={handleUpload}>
            Upload
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;