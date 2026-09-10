/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Blockly from "blockly";

interface ControlsIfState {
  elseifCount?: number;
  hasElse?: boolean;
}

/**
 * ============================================================
 * FIELD NÚT XÓA NHÁNH ⊖
 * ============================================================
 */

class RemoveBranchField extends Blockly.Field {
  private callback_: () => void;

  constructor(
    callback: () => void
  ) {
    super("⊖");

    this.callback_ = callback;

    this.SERIALIZABLE = false;
  }

  protected showEditor_() {
    this.callback_();
  }

  static fromJson(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: any
  ) {
    return new RemoveBranchField(
      () => {}
    );
  }
}

/**
 * ============================================================
 * CONTROLS IF
 * ============================================================
 */

export const registerControlsIfBlock = () => {
  Blockly.Blocks["controls_if"] = {
    init() {
      this.elseifCount_ = 0;
      this.hasElse_ = false;

      this.setColour("#3BA1C5");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setInputsInline(false);

      this.setTooltip(
        "Nếu điều kiện đúng thì thực hiện các lệnh"
      );

      this.updateShape_();
    },

    /**
     * ========================================================
     * UPDATE SHAPE
     * ========================================================
     */

    updateShape_() {
      // ------------------------------------------------------
      // IF
      // ------------------------------------------------------

      if (!this.getInput("IF0")) {
        this.appendValueInput("IF0")
          .setCheck("Boolean")
          .appendField("nếu")
          .appendField("thì");
      }

      if (!this.getInput("DO0")) {
        this.appendStatementInput("DO0");
      }

      // ------------------------------------------------------
      // ELSE IF
      // ------------------------------------------------------

      for (
        let i = 1;
        i <= this.elseifCount_;
        i++
      ) {
        this.createElseIf_(i);
      }

      // ------------------------------------------------------
      // ELSE
      // ------------------------------------------------------

      if (this.hasElse_) {
        this.createElse_();
      } else {
        if (this.getInput("ELSE")) {
          this.removeInput(
            "ELSE",
            true
          );
        }

        if (this.getInput("DO_ELSE")) {
          this.removeInput(
            "DO_ELSE",
            true
          );
        }
      }

      // ------------------------------------------------------
      // NÚT +
      // ------------------------------------------------------

      if (this.getInput("ADD_BUTTON")) {
        this.removeInput(
          "ADD_BUTTON",
          true
        );
      }

      const addButton =
        this.appendDummyInput(
          "ADD_BUTTON"
        );

      const addDropdown =
        new Blockly.FieldDropdown(
          [
            ["⊕", "NONE"],
            ["còn nếu", "ELSE_IF"],
            ["còn lại thì", "ELSE"],
          ],
          (value) => {
            if (value === "ELSE_IF") {
              this.addElseIf_();
            }

            if (value === "ELSE") {
              this.addElse_();
            }

            return "NONE";
          }
        );

      addButton.appendField(
        addDropdown,
        "ADD_MENU"
      );

      // ------------------------------------------------------
      // Đảm bảo thứ tự:
      //
      // IF
      // DO
      // ELSE IF
      // DO
      // ELSE
      // DO
      // +
      // ------------------------------------------------------

      if (this.hasElse_) {
        for (
          let i = 1;
          i <= this.elseifCount_;
          i++
        ) {
          if (this.getInput(`IF${i}`)) {
            this.moveInputBefore(
              `IF${i}`,
              "ELSE"
            );
          }

          if (this.getInput(`DO${i}`)) {
            this.moveInputBefore(
              `DO${i}`,
              "ELSE"
            );
          }
        }

        if (this.getInput("ELSE")) {
          this.moveInputBefore(
            "ELSE",
            "ADD_BUTTON"
          );
        }

        if (this.getInput("DO_ELSE")) {
          this.moveInputBefore(
            "DO_ELSE",
            "ADD_BUTTON"
          );
        }
      }
    },

    /**
     * ========================================================
     * TẠO ELSE IF
     * ========================================================
     */

    createElseIf_(index: number) {
      // ------------------------------------------------------
      // IF
      // ------------------------------------------------------

      if (!this.getInput(`IF${index}`)) {
        const input =
          this.appendValueInput(
            `IF${index}`
          ).setCheck("Boolean");

        input.appendField(
          "còn nếu"
        );

        input.appendField(
          new RemoveBranchField(
            () => {
              this.removeElseIf_(
                index
              );
            }
          ),
          `REMOVE_ELSE_IF_${index}`
        );

        input.appendField(
          "thì"
        );
      }

      // ------------------------------------------------------
      // DO
      // ------------------------------------------------------

      if (!this.getInput(`DO${index}`)) {
        this.appendStatementInput(
          `DO${index}`
        );
      }

      // ELSE IF luôn nằm trước ELSE
      if (
        this.hasElse_ &&
        this.getInput("ELSE")
      ) {
        this.moveInputBefore(
          `IF${index}`,
          "ELSE"
        );

        this.moveInputBefore(
          `DO${index}`,
          "ELSE"
        );
      }
    },

    /**
     * ========================================================
     * TẠO ELSE
     * ========================================================
     */

    createElse_() {
      // ------------------------------------------------------
      // HEADER
      // ------------------------------------------------------

      if (!this.getInput("ELSE")) {
        const input =
          this.appendDummyInput(
            "ELSE"
          );

        input.appendField(
          "còn lại thì"
        );

        input.appendField(
          new RemoveBranchField(
            () => {
              this.removeElse_();
            }
          ),
          "REMOVE_ELSE"
        );
      }

      // ------------------------------------------------------
      // DO
      // ------------------------------------------------------

      if (!this.getInput("DO_ELSE")) {
        this.appendStatementInput(
          "DO_ELSE"
        );
      }

      // ELSE trước +
      if (
        this.getInput("ADD_BUTTON")
      ) {
        this.moveInputBefore(
          "ELSE",
          "ADD_BUTTON"
        );

        this.moveInputBefore(
          "DO_ELSE",
          "ADD_BUTTON"
        );
      }
    },

    /**
     * ========================================================
     * THÊM ELSE IF
     * ========================================================
     */

    addElseIf_() {
      if (
        this.elseifCount_ >= 63
      ) {
        return;
      }

      this.elseifCount_++;

      this.updateShape_();

      this.render();
    },

    /**
     * ========================================================
     * XÓA ELSE IF
     * ========================================================
     */

    removeElseIf_(
      index: number
    ) {
      if (
        index < 1 ||
        index > this.elseifCount_
      ) {
        return;
      }

      // ------------------------------------------------------
      // LƯU CONNECTION
      // ------------------------------------------------------

      const connections: {
        ifConnection:
          | Blockly.Connection
          | null;

        doConnection:
          | Blockly.Connection
          | null;
      }[] = [];

      for (
        let i = 1;
        i <= this.elseifCount_;
        i++
      ) {
        if (i === index) {
          continue;
        }

        const ifInput =
          this.getInput(
            `IF${i}`
          );

        const doInput =
          this.getInput(
            `DO${i}`
          );

        connections.push({
          ifConnection:
            ifInput?.connection
              ?.targetConnection ||
            null,

          doConnection:
            doInput?.connection
              ?.targetConnection ||
            null,
        });
      }

      // ------------------------------------------------------
      // XÓA CÁC NHÁNH CŨ
      // ------------------------------------------------------

      for (
        let i = 1;
        i <= this.elseifCount_;
        i++
      ) {
        if (
          this.getInput(
            `IF${i}`
          )
        ) {
          this.removeInput(
            `IF${i}`,
            true
          );
        }

        if (
          this.getInput(
            `DO${i}`
          )
        ) {
          this.removeInput(
            `DO${i}`,
            true
          );
        }
      }

      this.elseifCount_--;

      // ------------------------------------------------------
      // TẠO LẠI
      // ------------------------------------------------------

      for (
        let i = 1;
        i <= this.elseifCount_;
        i++
      ) {
        this.createElseIf_(i);
      }

      // ------------------------------------------------------
      // KHÔI PHỤC CONNECTION
      // ------------------------------------------------------

      connections.forEach(
        (item, index) => {
          const newIndex =
            index + 1;

          const ifInput =
            this.getInput(
              `IF${newIndex}`
            );

          const doInput =
            this.getInput(
              `DO${newIndex}`
            );

          if (
            ifInput?.connection &&
            item.ifConnection
          ) {
            try {
              ifInput.connection.connect(
                item.ifConnection
              );
            } catch (e) {
              console.warn(
                "Không thể khôi phục IF:",
                e
              );
            }
          }

          if (
            doInput?.connection &&
            item.doConnection
          ) {
            try {
              doInput.connection.connect(
                item.doConnection
              );
            } catch (e) {
              console.warn(
                "Không thể khôi phục DO:",
                e
              );
            }
          }
        }
      );

      this.updateShape_();

      this.render();
    },

    /**
     * ========================================================
     * THÊM ELSE
     * ========================================================
     */

    addElse_() {
      if (this.hasElse_) {
        return;
      }

      this.hasElse_ = true;

      this.updateShape_();

      this.render();
    },

    /**
     * ========================================================
     * XÓA ELSE
     * ========================================================
     */

    removeElse_() {
      if (!this.hasElse_) {
        return;
      }

      this.hasElse_ = false;

      this.updateShape_();

      this.render();
    },

    /**
     * ========================================================
     * SAVE JSON
     * ========================================================
     */

    saveExtraState() {
      return {
        elseifCount:
          this.elseifCount_,

        hasElse:
          this.hasElse_,
      };
    },

    /**
     * ========================================================
     * LOAD JSON
     * ========================================================
     */

    loadExtraState(
      state: ControlsIfState
    ) {
      this.elseifCount_ =
        Math.max(
          0,
          Math.min(
            63,
            Number(
              state?.elseifCount || 0
            )
          )
        );

      this.hasElse_ =
        Boolean(
          state?.hasElse
        );

      this.updateShape_();
    },

    /**
     * ========================================================
     * XML
     * ========================================================
     */

    mutationToDom() {
      const mutation =
        Blockly.utils.xml.createElement(
          "mutation"
        );

      mutation.setAttribute(
        "elseif",
        String(
          this.elseifCount_
        )
      );

      mutation.setAttribute(
        "else",
        String(
          this.hasElse_
        )
      );

      return mutation;
    },

    domToMutation(
      xmlElement: Element
    ) {
      this.elseifCount_ =
        Math.max(
          0,
          Math.min(
            63,
            parseInt(
              xmlElement.getAttribute(
                "elseif"
              ) || "0",
              10
            )
          )
        );

      this.hasElse_ =
        xmlElement.getAttribute(
          "else"
        ) === "true";

      this.updateShape_();
    },
  };
};

registerControlsIfBlock();