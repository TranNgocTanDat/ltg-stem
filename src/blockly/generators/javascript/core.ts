import { javascriptGenerator } from "blockly/javascript";

/* 🟢 ON START */
javascriptGenerator.forBlock["on_start"] = function (block) {
  const statements =
    javascriptGenerator.statementToCode(block, "DO");

  return `
(async function __onStart() {
${statements}
})();
`;
};


/* 🔁 FOREVER */
javascriptGenerator.forBlock["forever"] = function (block) {
  const body =
    javascriptGenerator.statementToCode(block, "DO");

  return `
(async function foreverLoop() {
  while (__runtime.running) {
${body}
    await __sleep(20);
  }
})();
`;
};




/* ⏱ WAIT */
javascriptGenerator.forBlock["wait_ms"] = function (block) {
  const ms =
    javascriptGenerator.valueToCode(block, "TIME", 0) || "0";

  return `await __sleep(${ms});\n`;
};

