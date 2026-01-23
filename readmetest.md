// ===== UUID giống firmware =====
const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const RX_CHAR_UUID = 'abcd1234-1234-1234-1234-abcdef123456';
const TX_CHAR_UUID = 'abcd5678-1234-1234-1234-abcdef654321';

let device, server, service, rxChar, txChar;

// ===== CONNECT =====
async function bleConnect() {
  device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: 'ESP32' }],
    optionalServices: [SERVICE_UUID]
  });

  server = await device.gatt.connect();
  service = await server.getPrimaryService(SERVICE_UUID);

  rxChar = await service.getCharacteristic(RX_CHAR_UUID);
  txChar = await service.getCharacteristic(TX_CHAR_UUID);

  // listen notify
  await txChar.startNotifications();
  txChar.addEventListener('characteristicvaluechanged', e => {
    const text = new TextDecoder().decode(e.target.value);
    console.log('[BLE TX]', text);
  });

  console.log('✅ BLE Connected');
}

//realtime
rxChar.writeValue(
  new TextEncoder().encode(
    JSON.stringify({
      cmd: "set_mode",
      args: {
        mode: "realtime"
      }
    })
  )
);

//rgb
rxChar.writeValue(
  new TextEncoder().encode(
    JSON.stringify({
      cmd: "rgb",
      args: {
        port: "P2",
        r: 255,
        g: 0,
        b: 0
      }
    })
  )
);

{
  "cmd": "rgb",
  "args": {
    "port": "P2",
    "r": 255,
    "g": 0,
    "b": 0,
    "brightness": 50
  }
}

{
  "cmd": "rgb",
  "args": {
    "port": "P2",
    "index": 2,
    "r": 0,
    "g": 255,
    "b": 0
  }
}
