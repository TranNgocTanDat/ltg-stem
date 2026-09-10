import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";

/**
 * =========================================================
 * NOTE MAPPING
 * Lấy đúng theo note_map trong API firmware
 * =========================================================
 */
const NOTE_MAP: Record<string, number> = {
  C1: 33,
  D1: 37,
  E1: 41,
  F1: 44,
  G1: 49,
  A1: 55,
  B1: 62,

  C2: 65,
  D2: 73,
  E2: 82,
  F2: 87,
  G2: 98,
  A2: 110,
  B2: 123,

  C3: 131,
  D3: 147,
  E3: 165,
  F3: 175,
  G3: 196,
  A3: 220,
  B3: 247,

  C4: 262,
  D4: 294,
  E4: 330,
  F4: 349,
  G4: 392,
  A4: 440,
  B4: 494,

  C5: 523,
  D5: 587,
  E5: 659,
  F5: 698,
  G5: 784,
  A5: 880,
  B5: 988,

  C6: 1047,
  D6: 1175,
  E6: 1319,
  F6: 1397,
  G6: 1568,
  A6: 1760,
  B6: 1976,

  C7: 2093,
  D7: 2349,
  E7: 2637,
  F7: 2794,
  G7: 3136,
  A7: 3520,
  B7: 3951,

  C8: 4186,
  D8: 4699,
};


/**
 * =========================================================
 * NOTE LENGTH
 *
 * Firmware:
 * S4   -> 4
 * S2   -> 2
 * S1   -> 1
 * S12  -> 1/2
 * S14  -> 1/4
 * S18  -> 1/8
 * S116 -> 1/16
 * =========================================================
 */
const NOTE_LENGTH_MAP: Record<string, string> = {
  "4": "4",
  "2": "2",
  "1": "1",
  "1/2": "1/2",
  "1/4": "1/4",
  "1/8": "1/8",
  "1/16": "1/16",
};


/**
 * =========================================================
 * BUZZER ON / OFF
 *
 * Firmware:
 * await board.SetBuzzer(state, rid)
 *
 * Dùng True / False thay vì 1 / 0
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_set"] = function (
  block: Blockly.Block
) {
  const state =
    block.getFieldValue("STATE") === "ON"
      ? "True"
      : "False";

  return `await board.SetBuzzer(${state}, 3)\n`;
};


/**
 * =========================================================
 * SET BPM
 *
 * Firmware:
 * await buzzer.SetBPM(bpm, rid)
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_set_bpm"] = function (
  block: Blockly.Block
) {
  const bpm =
    pythonGenerator.valueToCode(
      block,
      "BPM",
      3
    ) || "120";

  return `await buzzer.SetBPM(${bpm}, 3)\n`;
};


/**
 * =========================================================
 * PLAY TONE
 *
 * Firmware:
 * await buzzer.PlayTone(freq, time, rid)
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_play_tone"] = function (
  block: Blockly.Block
) {
  const freq =
    pythonGenerator.valueToCode(
      block,
      "FREQ",
      3
    ) || "440";

  const time =
    pythonGenerator.valueToCode(
      block,
      "TIME",
      3
    ) || "500";

  return `await buzzer.PlayTone(${freq}, ${time}, 3)\n`;
};


/**
 * =========================================================
 * PLAY NOTE
 *
 * Firmware PlayNote Python thực tế gọi:
 *
 * await buzzer.PlayTone(note, time, rid)
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_play_note"] = function (
  block: Blockly.Block
) {
  const note =
    pythonGenerator.valueToCode(
      block,
      "NOTE",
      3
    ) || "440";

  const time =
    pythonGenerator.valueToCode(
      block,
      "TIME",
      3
    ) || "500";

  return `await buzzer.PlayTone(${note}, ${time}, 3)\n`;
};


/**
 * =========================================================
 * PLAY SONG
 *
 * Firmware:
 * await buzzer.play_melody(
 *   melody="HappyBirthday",
 *   rid
 * )
 *
 * Không tạo:
 * melody="HappyBirthday", 3
 *
 * vì đó là positional argument sau keyword.
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_play_song"] = function (
  block: Blockly.Block
) {
  const song =
    block.getFieldValue("SONG") ||
    "HappyBirthday";

  return `await buzzer.play_melody("${song}", 3)\n`;
};


/**
 * =========================================================
 * PLAY BASIC NOTE
 *
 * C1 + 1/4
 *
 * =>
 * await buzzer.PlayNote_Basic(33, 1/4, 3)
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_play_basic"] = function (
  block: Blockly.Block
) {
  const note =
    block.getFieldValue("NOTE") || "C4";

  const beat =
    block.getFieldValue("BEAT") || "1";

  const frequency =
    NOTE_MAP[note] ?? 262;

  const noteLength =
    NOTE_LENGTH_MAP[beat] ?? "1";

  return `await buzzer.PlayNote_Basic(${frequency}, ${noteLength}, 3)\n`;
};


/**
 * =========================================================
 * PLAY NOTE MIDI
 *
 * Firmware gốc:
 *
 * await PlayNote(semi, beat, rid)
 *
 * KHÔNG phải:
 * await buzzer.PlayNote(...)
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_play_note_"] = function (
  block: Blockly.Block
) {
  const semi =
    pythonGenerator.valueToCode(
      block,
      "SEMI",
      3
    ) || "60";

  const beat =
    pythonGenerator.valueToCode(
      block,
      "BEAT",
      3
    ) || "1";

  return `await PlayNote(${semi}, ${beat}, 3)\n`;
};


/**
 * =========================================================
 * MUTE
 *
 * Firmware:
 * await buzzer.PlayMute(beat, rid)
 * =========================================================
 */
pythonGenerator.forBlock["buzzer_mute"] = function (
  block: Blockly.Block
) {
  const beat =
    block.getFieldValue("BEAT") || "1/4";

  const noteLength =
    NOTE_LENGTH_MAP[beat] ?? "1/4";

  return `await buzzer.PlayMute(${noteLength}, 3)\n`;
};