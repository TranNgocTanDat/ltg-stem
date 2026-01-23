import { ble } from "@/bluetooth/bleManager";

const __runtime = {
  running: false,
};

function __sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function runProgram(code: string) {
  stopProgram();
  __runtime.running = true;

  try {
    const fn = new Function(
      "ble",
      "__sleep",
      "__runtime",
      `
${code}
`
    );

    fn(ble, __sleep, __runtime);
  } catch (e) {
    console.error("❌ Runtime error", e);
  }
}

export function stopProgram() {
  __runtime.running = false;
}
