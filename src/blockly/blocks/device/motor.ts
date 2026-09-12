import * as Blockly from "blockly";
import img_forward from "@/assets/icons/forward.png";
import img_backward from "@/assets/icons/backward.png";
import img_stop from "@/assets/icons/stop.png";
import img_turn_left from "@/assets/icons/turn_left.png";
import img_turn_right from "@/assets/icons/turn_right.png";
import img_rotate_left from "@/assets/icons/rotate_left.png";
import img_rotate_right from "@/assets/icons/rotate_right.png";
import TimeStepperField from "../flieds/TimeStepperField";

Blockly.Blocks["robot_forward"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage(img_forward, 60, 60, "Robot"))
      .appendField("Đi thẳng");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);
    this.setColour("#F9940C");

    this.setTooltip("Robot đi thẳng");
  },
};

Blockly.Blocks["robot_forward_ms"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage(img_forward, 60, 60, "Robot"))
      .appendField("Đi thẳng");

    this.appendDummyInput().appendField("trong");

    this.appendValueInput("TIME").setCheck("Number");

    this.appendDummyInput().appendField("giây");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#F9940C");

    this.setTooltip("Robot đi thẳng trong khoảng thời gian");
  },
};

Blockly.Blocks["robot_backward"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage(img_backward, 60, 60, "Robot"))
      .appendField("Đi lùi");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#F9940C");

    this.setTooltip("Robot đi lùi");
  },
};

Blockly.Blocks["robot_backward_ms"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage(img_backward, 60, 60, "Robot"))
      .appendField("Đi lùi");

    this.appendDummyInput().appendField("trong");

    this.appendValueInput("TIME").setCheck("Number");

    this.appendDummyInput().appendField("giây");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#F9940C");
  },
};

Blockly.Blocks["robot_stop"] = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(img_stop, 60, 60, "Robot"))
      .appendField("Dừng lại");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setColour("#F44336");
  },
};

Blockly.Blocks["robot_rotate_left"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage(img_rotate_left, 60, 60, "Robot"))
      .appendField("Xoay trái với tốc độ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#F9940C");

    this.setTooltip("Robot xoay trái");
  },
};

Blockly.Blocks["robot_rotate_right"] = {
  init() {
    this.appendValueInput("POWER")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage(img_rotate_right, 60, 60, "Robot"))
      .appendField("Xoay phải với tốc độ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#F9940C");

    this.setTooltip("Robot xoay phải");
  },
};

// Blockly.Blocks["robot_rotate_left_ms"] = {
//   init() {
//     this.appendDummyInput().appendField(
//       new Blockly.FieldImage(img_turn_left, 60, 60, "Robot"),
//     ).appendField("Rẽ trái");
// ;

//     this.appendValueInput("TIME").setCheck("Number");

//     this.appendDummyInput().appendField("ms");

//     this.setPreviousStatement(true);
//     this.setNextStatement(true);

//     this.setInputsInline(true);

//     this.setColour("#F9940C");

//     this.setTooltip(
//       "Robot xoay trái với tốc độ 80 trong khoảng thời gian rồi dừng",
//     );
//   },
// };

Blockly.Blocks["robot_rotate_left_ms"] = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(img_turn_left, 60, 60, "Robot"))
      .appendField("Rẽ trái")
      .appendField(new TimeStepperField(500), "TIME");

    this.setPreviousStatement(true);

    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#F9940C");

    this.setTooltip("Robot rẽ trái trong khoảng thời gian rồi dừng");
  },
};

// Blockly.Blocks["robot_rotate_right_ms"] = {
//   init() {
//     this.appendDummyInput()
//       .appendField(new Blockly.FieldImage(img_turn_right, 60, 60, "Robot"))
//       .appendField("Rẽ phải");

//     this.appendValueInput("TIME").setCheck("Number");

//     this.appendDummyInput().appendField("ms");

//     this.setPreviousStatement(true);
//     this.setNextStatement(true);

//     this.setInputsInline(true);

//     this.setColour("#F9940C");

//     this.setTooltip(
//       "Robot xoay phải với tốc độ 80 trong khoảng thời gian rồi dừng",
//     );
//   },
// };

Blockly.Blocks["robot_rotate_right_ms"] = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(img_turn_right, 60, 60, "Robot"))
      .appendField("Rẽ phải")
      .appendField(new TimeStepperField(500), "TIME");

    this.setPreviousStatement(true);

    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#F9940C");

    this.setTooltip("Robot rẽ phải trong khoảng thời gian rồi dừng");
  },
};

Blockly.Blocks["GetButtonOnboard"] = {
  init() {
    this.appendDummyInput().appendField("Nút trên robot");

    this.setOutput(true, "Boolean");

    this.setColour("#3BA1C5");

    this.setTooltip("Đọc trạng thái nút trên robot");
  },
};
