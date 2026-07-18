export interface BleConfig {
  filters?: BluetoothLEScanFilter[];

  optionalServices: BluetoothServiceUUID[];

  serviceUUID: BluetoothServiceUUID;

  characteristicUUID: BluetoothCharacteristicUUID;
}