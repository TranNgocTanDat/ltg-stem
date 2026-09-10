import * as Blockly from "blockly";

/**
 * =========================================================
 * DEFAULT LED COLOR
 * =========================================================
 */

const DEFAULT_LED_COLOR = "0xff0000";

/**
 * =========================================================
 * LED COLORS
 * =========================================================
 *
 * value phải khớp với API firmware
 */

const LED_COLORS = [
  { color: "#ff0000", value: "0xff0000" }, // Đỏ
  { color: "#ff8000", value: "0xff8000" }, // Cam
  { color: "#ffff00", value: "0xffff00" }, // Vàng
  { color: "#ff9da5", value: "0xff9da5" }, // Hồng nhạt

  { color: "#00ff00", value: "0x00ff00" }, // Xanh lá
  { color: "#b09eff", value: "0xb09eff" }, // Tím nhạt
  { color: "#00ffff", value: "0x00ffff" }, // Cyan
  { color: "#007fff", value: "0x007fff" }, // Xanh da trời

  { color: "#65471f", value: "0x65471f" }, // Nâu
  { color: "#0000ff", value: "0x0000ff" }, // Xanh dương
  { color: "#7f00ff", value: "0x7f00ff" }, // Tím
  { color: "#ff0080", value: "0xff0080" }, // Hồng

  { color: "#ff00ff", value: "0xff00ff" }, // Tím hồng
  { color: "#ffffff", value: "0xffffff" }, // Trắng
  { color: "#999999", value: "0x999999" }, // Xám
  { color: "#000000", value: "0x000000" }, // Đen
];

/**
 * =========================================================
 * CUSTOM COLOR FIELD
 * =========================================================
 */

class LEDColorField extends Blockly.Field<string> {
  private colorValue_: string;

  constructor(
    value: string = DEFAULT_LED_COLOR,
    validator?: Blockly.FieldValidator<string>,
  ) {
    super(value, validator);

    /**
     * Nếu value không hợp lệ
     * thì luôn quay về màu mặc định
     */
    const validColor = LED_COLORS.some((item) => item.value === value);

    this.colorValue_ = validColor ? value : DEFAULT_LED_COLOR;
  }

  /**
   * =======================================================
   * KHỞI TẠO GIAO DIỆN
   * =======================================================
   *
   * Đây là phần QUAN TRỌNG NHẤT.
   *
   * Trước đây:
   *
   * Kéo block ra
   *      ↓
   * Field chưa gọi updateColour_()
   *      ↓
   * Hiện "0xff0000"
   *
   * Bây giờ:
   *
   * Kéo block ra
   *      ↓
   * initView()
   *      ↓
   * updateColour_()
   *      ↓
   * Hiện ô màu ngay lập tức
   */

  protected override initView() {
    super.initView();

    /**
     * Hiển thị ô màu ngay khi Field được tạo
     */
    this.updateColour_();
  }

  /**
   * =======================================================
   * ĐỒNG BỘ VALUE
   * =======================================================
   *
   * Blockly lưu:
   *
   * 0xff0000
   * 0x00ff00
   * 0x0000ff
   * ...
   *
   * Nhưng UI chỉ hiển thị ô màu.
   */

  protected override doValueUpdate_(newValue: string) {
    /**
     * Nếu value không hợp lệ
     * thì sử dụng màu mặc định
     */

    const validColor = LED_COLORS.some((item) => item.value === newValue);

    const finalValue = validColor ? newValue : DEFAULT_LED_COLOR;

    /**
     * Cập nhật value thật của Blockly
     */

    super.doValueUpdate_(finalValue);

    /**
     * Lưu value nội bộ
     */

    this.colorValue_ = finalValue;

    /**
     * Cập nhật giao diện
     */

    this.updateColour_();
  }

  /**
   * =======================================================
   * HIỂN THỊ Ô MÀU
   * =======================================================
   */

  protected updateColour_() {
    /**
     * Lấy HEX tương ứng
     *
     * 0xff0000 -> #ff0000
     * 0x00ff00 -> #00ff00
     * ...
     */

    const color = this.getColorHex_();

    /**
     * Kích thước Field
     */

    this.size_.width = 36;
    this.size_.height = 28;

    /**
     * textElement_ được Blockly tạo
     * sau super.initView()
     */

    if (this.textElement_) {
      /**
       * Không hiển thị:
       *
       * 0xff0000
       *
       * mà hiển thị:
       *
       * ■
       */

      this.textElement_.textContent = "■";

      /**
       * Màu của hình vuông
       */

      this.textElement_.style.fill = color;

      /**
       * Viền
       */

      this.textElement_.style.stroke = "#555";

      this.textElement_.style.strokeWidth = "1px";

      /**
       * Kích thước hình vuông
       */

      this.textElement_.style.fontSize = "24px";

      this.textElement_.style.fontFamily = "Arial";

      /**
       * Không cho text bị ảnh hưởng
       */

      this.textElement_.style.pointerEvents = "none";
    }
  }

  /**
   * =======================================================
   * LẤY MÀU HEX
   * =======================================================
   *
   * Ví dụ:
   *
   * 0xff0000
   *      ↓
   * #ff0000
   */

  private getColorHex_(): string {
    const item = LED_COLORS.find((item) => item.value === this.colorValue_);

    return item?.color || "#ff0000";
  }

  /**
   * =======================================================
   * VALIDATE VALUE
   * =======================================================
   */

  override doClassValidation_(newValue?: string): string | null {
    /**
     * Không có value
     */

    if (!newValue) {
      return null;
    }

    /**
     * Kiểm tra value có nằm trong danh sách màu
     */

    const exists = LED_COLORS.some((item) => item.value === newValue);

    /**
     * Hợp lệ
     */

    if (exists) {
      return newValue;
    }

    /**
     * Không hợp lệ
     */

    return null;
  }

  /**
   * =======================================================
   * MỞ BẢNG CHỌN MÀU
   * =======================================================
   */

  protected showEditor_() {
    /**
     * =====================================================
     * TẠO POPUP
     * =====================================================
     */

    const dropdown = document.createElement("div");

    dropdown.style.position = "absolute";

    dropdown.style.display = "grid";

    dropdown.style.gridTemplateColumns = "repeat(4, 34px)";

    dropdown.style.gap = "5px";

    dropdown.style.padding = "8px";

    dropdown.style.background = "#ffffff";

    dropdown.style.border = "1px solid #d0d0d0";

    dropdown.style.borderRadius = "8px";

    dropdown.style.boxShadow = "0 4px 16px rgba(0,0,0,0.25)";

    dropdown.style.zIndex = "999999";

    /**
     * =====================================================
     * VỊ TRÍ POPUP
     * =====================================================
     */

    const root = this.getClickTarget_();

    if (root) {
      const rect = root.getBoundingClientRect();

      dropdown.style.left = `${rect.left}px`;

      dropdown.style.top = `${rect.bottom + 5}px`;
    }

    /**
     * =====================================================
     * TẠO 16 Ô MÀU
     * =====================================================
     */

    LED_COLORS.forEach((item) => {
      const button = document.createElement("button");

      button.type = "button";

      /**
       * Kích thước
       */

      button.style.width = "34px";

      button.style.height = "34px";

      /**
       * Không padding
       */

      button.style.padding = "0";

      /**
       * Viền
       */

      button.style.border = "2px solid #ddd";

      button.style.borderRadius = "5px";

      /**
       * Màu nền
       */

      button.style.background = item.color;

      /**
       * Con trỏ
       */

      button.style.cursor = "pointer";

      /**
       * Tooltip
       *
       * Ví dụ:
       *
       * 0xff0000
       */

      button.title = item.value;

      /**
       * ===================================================
       * HOVER
       * ===================================================
       */

      button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.08)";

        button.style.boxShadow = "0 0 0 2px #555";
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";

        button.style.boxShadow = "none";
      });

      /**
       * ===================================================
       * CHỌN MÀU
       * ===================================================
       */

      button.addEventListener("mousedown", (event) => {
        /**
         * Ngăn Blockly xử lý event
         */

        event.preventDefault();

        event.stopPropagation();

        /**
         * Cập nhật value thật
         *
         * Ví dụ:
         *
         * 0xff0000
         * 0x00ff00
         * 0x0000ff
         */

        this.setValue(item.value);

        /**
         * Đóng popup
         */

        dropdown.remove();

        /**
         * Xóa event click ngoài
         */

        document.removeEventListener("mousedown", outsideClick);
      });

      /**
       * Thêm button vào popup
       */

      dropdown.appendChild(button);
    });

    /**
     * =====================================================
     * THÊM POPUP VÀO BODY
     * =====================================================
     */

    document.body.appendChild(dropdown);

    /**
     * =====================================================
     * CLICK RA NGOÀI -> ĐÓNG POPUP
     * =====================================================
     */

    const outsideClick = (event: MouseEvent) => {
      if (!dropdown.contains(event.target as Node)) {
        dropdown.remove();

        document.removeEventListener("mousedown", outsideClick);
      }
    };

    /**
     * Delay để tránh event
     * click hiện tại đóng popup ngay
     */

    setTimeout(() => {
      document.addEventListener("mousedown", outsideClick);
    }, 0);
  }

  /**
   * =======================================================
   * GET TEXT
   * =======================================================
   *
   * Blockly / Generator vẫn nhận:
   *
   * 0xff0000
   *
   * chứ không nhận:
   *
   * ■
   */

  override getText(): string {
    return this.colorValue_;
  }
}

/**
 * =========================================================
 * ĐĂNG KÝ FIELD
 * =========================================================
 */

Blockly.fieldRegistry.register("led_color", LEDColorField);

/**
 * =========================================================
 * COLOR PICKER BLOCK
 * =========================================================
 */

Blockly.Blocks["colorNumberPicker"] = {
  init() {
    this.appendDummyInput().appendField(
      new LEDColorField(DEFAULT_LED_COLOR),
      "value",
    );

    this.setOutput(true, "Colour");

    this.setColour("#E91E63");

    this.setTooltip("Chọn màu LED");
  },
};

/**
 * =========================================================
 * LED SET ALL
 * =========================================================
 */

Blockly.Blocks["led_set_all"] = {
  init() {
    this.appendValueInput("COLOUR")
      .setCheck("Colour")
      .appendField("💡 LED: Bật tất cả");

    this.setPreviousStatement(true);

    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#E91E63");

    this.setTooltip("Bật tất cả LED với màu được chọn");
  },
};

/**
 * =========================================================
 * LED SET SINGLE
 * =========================================================
 */

Blockly.Blocks["led_set_single"] = {
  init() {
    this.appendValueInput("POSITION")
      .setCheck("Number")
      .appendField("💡 LED số");

    this.appendValueInput("COLOUR").setCheck("Colour").appendField("màu");

    this.setPreviousStatement(true);

    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#E91E63");

    this.setTooltip("Đặt màu cho một LED");
  },
};

/**
 * =========================================================
 * LED OFF
 * =========================================================
 */

Blockly.Blocks["led_off"] = {
  init() {
    this.appendDummyInput().appendField("💡 LED: Tắt");

    this.setPreviousStatement(true);

    this.setNextStatement(true);

    this.setColour("#F44336");

    this.setTooltip("Tắt tất cả LED");
  },
};

/**
 * =========================================================
 * LED WIPE
 * =========================================================
 */

Blockly.Blocks["led_wipe"] = {
  init() {
    this.appendValueInput("COLOUR")
      .setCheck("Colour")
      .appendField("💡 LED: Chạy màu");

    this.appendValueInput("SPEED").setCheck("Number").appendField("tốc độ");

    this.setPreviousStatement(true);

    this.setNextStatement(true);

    this.setInputsInline(true);

    this.setColour("#E91E63");

    this.setTooltip("Chạy hiệu ứng màu trên LED");
  },
};
