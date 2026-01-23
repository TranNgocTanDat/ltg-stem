import { pythonGenerator } from "blockly/python";

/* ========= ADD PREFIX ========= */
const originalFinish = pythonGenerator.finish;

pythonGenerator.finish = function (code: string) {
  const prefix = `
from time import sleep_ms

# Device API (stub)
def rgb_set(port, index, r, g, b):
    pass

`;

  return prefix + originalFinish.call(this, code);
};
