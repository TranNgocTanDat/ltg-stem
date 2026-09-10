import * as Blockly from "blockly";

/**
 * =========================
 * BUZZER - ON / OFF
 * Firmware:
 * await board.SetBuzzer(state, rid)
 * =========================
 */
Blockly.Blocks["buzzer_set"] = {
  init() {
    this.appendDummyInput()
      .appendField("còi")
      .appendField(
        new Blockly.FieldDropdown([
          ["bật", "1"],
          ["tắt", "0"],
        ]),
        "STATE"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Bật hoặc tắt còi");
  },
};


/**
 * =========================
 * SET BPM
 *
 * Firmware:
 * await buzzer.SetBPM(bpm, rid)
 * =========================
 */
Blockly.Blocks["buzzer_set_bpm"] = {
  init() {
    this.appendValueInput("BPM")
      .setCheck("Number")
      .appendField("đặt BPM");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Đặt tốc độ phát nhạc");
  },
};


/**
 * =========================
 * PLAY TONE
 *
 * Firmware:
 * await buzzer.PlayTone(freq, time, rid)
 * =========================
 */
Blockly.Blocks["buzzer_play_tone"] = {
  init() {
    this.appendValueInput("FREQ")
      .setCheck("Number")
      .appendField("phát âm thanh");

    this.appendValueInput("TIME")
      .setCheck("Number")
      .appendField("trong");

    this.appendDummyInput()
      .appendField("ms");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Phát âm thanh theo tần số");
  },
};


/**
 * =========================
 * PLAY NOTE
 *
 * Firmware:
 * makecode.PlayNote
 *
 * Python:
 * await buzzer.PlayTone(note, time, rid)
 * =========================
 */
Blockly.Blocks["buzzer_play_note"] = {
  init() {
    this.appendValueInput("NOTE")
      .setCheck("Number")
      .appendField("phát nốt");

    this.appendValueInput("TIME")
      .setCheck("Number")
      .appendField("trong");

    this.appendDummyInput()
      .appendField("ms");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Phát một nốt theo tần số");
  },
};


/**
 * =========================
 * PLAY MELODY
 *
 * Firmware:
 * await buzzer.play_melody(melody, rid)
 * =========================
 */
Blockly.Blocks["buzzer_play_song"] = {
  init() {
    this.appendDummyInput()
      .appendField("phát bài hát")
      .appendField(
        new Blockly.FieldDropdown([
          ["Happy Birthday", "HappyBirthday"],
          ["Happy New Year", "HappyNewYear"],
          ["Kìa Con Bướm Vàng", "KiaConBuomVang"],
          ["Kiss The Rain", "KissTheRain"],
          ["Jingle Bell", "JingleBell"],
        ]),
        "SONG"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Phát bài hát có sẵn");
  },
};


/**
 * =========================
 * PLAY BASIC NOTE
 *
 * Firmware:
 * await buzzer.PlayNote_Basic(note, beat, rid)
 * =========================
 */
Blockly.Blocks["buzzer_play_basic"] = {
  init() {
    this.appendDummyInput()
      .appendField("phát nốt")
      .appendField(
        new Blockly.FieldDropdown([
          ["C1", "C1"],
          ["D1", "D1"],
          ["E1", "E1"],
          ["F1", "F1"],
          ["G1", "G1"],
          ["A1", "A1"],
          ["B1", "B1"],

          ["C2", "C2"],
          ["D2", "D2"],
          ["E2", "E2"],
          ["F2", "F2"],
          ["G2", "G2"],
          ["A2", "A2"],
          ["B2", "B2"],

          ["C3", "C3"],
          ["D3", "D3"],
          ["E3", "E3"],
          ["F3", "F3"],
          ["G3", "G3"],
          ["A3", "A3"],
          ["B3", "B3"],

          ["C4", "C4"],
          ["D4", "D4"],
          ["E4", "E4"],
          ["F4", "F4"],
          ["G4", "G4"],
          ["A4", "A4"],
          ["B4", "B4"],

          ["C5", "C5"],
          ["D5", "D5"],
          ["E5", "E5"],
          ["F5", "F5"],
          ["G5", "G5"],
          ["A5", "A5"],
          ["B5", "B5"],

          ["C6", "C6"],
          ["D6", "D6"],
          ["E6", "E6"],
          ["F6", "F6"],
          ["G6", "G6"],
          ["A6", "A6"],
          ["B6", "B6"],

          ["C7", "C7"],
          ["D7", "D7"],
          ["E7", "E7"],
          ["F7", "F7"],
          ["G7", "G7"],
          ["A7", "A7"],
          ["B7", "B7"],

          ["C8", "C8"],
          ["D8", "D8"],
          ["E8", "E8"],
          ["F8", "F8"],
          ["G8", "G8"],
          ["A8", "A8"],
          ["B8", "B8"],
        ]),
        "NOTE"
      )
      .appendField("độ dài")
      .appendField(
        new Blockly.FieldDropdown([
          ["1/16", "1/16"],
          ["1/8", "1/8"],
          ["1/4", "1/4"],
          ["1/2", "1/2"],
          ["1", "1"],
          ["2", "2"],
          ["4", "4"],
        ]),
        "BEAT"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Phát nốt nhạc theo độ dài");
  },
};


/**
 * =========================
 * PLAY NOTE_
 *
 * Firmware:
 * await PlayNote(semi, beat, rid)
 * =========================
 */
Blockly.Blocks["buzzer_play_note_"] = {
  init() {
    this.appendValueInput("SEMI")
      .setCheck("Number")
      .appendField("phát nốt MIDI");

    this.appendValueInput("BEAT")
      .setCheck("Number")
      .appendField("nhịp");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Phát nốt theo số bán cung và nhịp");
  },
};


/**
 * =========================
 * MUTE
 *
 * Firmware:
 * await buzzer.PlayMute(beat, rid)
 * =========================
 */
Blockly.Blocks["buzzer_mute"] = {
  init() {
    this.appendDummyInput()
      .appendField("nghỉ")
      .appendField(
        new Blockly.FieldDropdown([
          ["1/16", "1/16"],
          ["1/8", "1/8"],
          ["1/4", "1/4"],
          ["1/2", "1/2"],
          ["1", "1"],
          ["2", "2"],
          ["4", "4"],
        ]),
        "BEAT"
      );

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#F59E0B");
    this.setTooltip("Tạo khoảng lặng");
  },
};