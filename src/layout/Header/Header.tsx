import { useState } from "react";
import { ble } from "../../bluetooth/bleManager";
import { Button } from "@/components/ui/button"
import { Bluetooth } from "lucide-react";
import logo from "@/assets/logoltg.png";


const Header = () => {
  const [bleConnected, setBleConnected] = useState(false);

  const connectBLE = async () => {
    try {
      await ble.connect();
      setBleConnected(true);
    }
    catch (err) {
      console.error(err);
      alert("BLE connect failed");
    }
  };

  const disconnectBLE = () => {
    ble.disconnect();
    setBleConnected(false);
  };

  return (
    <header className="w-full h-16 bg-green-100 text-black flex items-center px-4">
      <div className="header-content flex justify-between w-full">
        <div className="header-logo w-[50%]" >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="header-function w-[50%] flex justify-start gap-2">
          <div className="ble">
            {!bleConnected ? (
              <>
                <Button variant="outline" onClick={connectBLE}><Bluetooth  /></Button>

              </>
            ) : (
              <Button variant="outline" onClick={disconnectBLE} className="bg-blue-500"><Bluetooth /></Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
