import * as Blockly from "blockly";

/**
 * =========================================================
 * CẤU HÌNH
 * =========================================================
 */

const DEFAULT_TIME = 500;
const MIN_TIME = 100;
const MAX_TIME = 5000;
const STEP_TIME = 100;

/**
 * =========================================================
 * TIME STEPPER FIELD
 * =========================================================
 *
 * Giao diện:
 *
 *     [ − ]  500 ms  [ + ]
 *
 * Không popup.
 */

class TimeStepperField extends Blockly.Field<string> {
  private timeValue_: number;

  private containerGroup_?: SVGGElement;

  private minusGroup_?: SVGGElement;
  private plusGroup_?: SVGGElement;

  private minusRect_?: SVGRectElement;
  private plusRect_?: SVGRectElement;

  private minusText_?: SVGTextElement;
  private plusText_?: SVGTextElement;

  private valueText_?: SVGTextElement;

  /**
   * Event data của Blockly
   */
  private minusEventData_: Blockly.browserEvents.Data | null = null;

  private plusEventData_: Blockly.browserEvents.Data | null = null;

  constructor(value: number = DEFAULT_TIME) {
    const normalized = TimeStepperField.normalize_(value);

    super(String(normalized));

    this.timeValue_ = normalized;
  }

  /**
   * ========================================================
   * CHUẨN HÓA GIÁ TRỊ
   * ========================================================
   */

  private static normalize_(value: number): number {
    if (!Number.isFinite(value)) {
      return DEFAULT_TIME;
    }

    return Math.min(MAX_TIME, Math.max(MIN_TIME, value));
  }

  /**
   * ========================================================
   * INIT VIEW
   * ========================================================
   */

  protected override initView() {
    super.initView();

    /**
     * Text mặc định của Blockly không dùng nữa.
     */

    if (this.textElement_) {
      this.textElement_.style.display = "none";
    }

    /**
     * Tạo giao diện:
     *
     * [ − ] 500 ms [ + ]
     */

    this.createStepperUI_();

    /**
     * Hiển thị giá trị ban đầu
     */

    this.updateStepperUI_();
  }

  /**
   * ========================================================
   * CREATE UI
   * ========================================================
   */

  private createStepperUI_() {
    if (!this.fieldGroup_) {
      return;
    }

    /**
     * ======================================================
     * GROUP CHÍNH
     * ======================================================
     */

    this.containerGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {},
      this.fieldGroup_,
    );

    /**
     * ======================================================
     * NÚT -
     * ======================================================
     */

    this.minusGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {
        class: "time-stepper-minus",
      },
      this.containerGroup_,
    );

    this.minusRect_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {
        x: 0,
        y: 2,
        width: 32,
        height: 28,
        rx: 6,
        ry: 6,

        fill: "#eeeeee",

        stroke: "#cccccc",

        "stroke-width": 1,
      },
      this.minusGroup_,
    );

    this.minusText_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.TEXT,
      {
        x: 16,
        y: 23,

        "text-anchor": "middle",

        fill: "#333333",

        "font-size": 20,

        "font-weight": "bold",

        "font-family": "Arial, sans-serif",

        "pointer-events": "none",
      },
      this.minusGroup_,
    );

    this.minusText_.textContent = "−";

    /**
     * ======================================================
     * GIÁ TRỊ
     * ======================================================
     */

    this.valueText_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.TEXT,
      {
        x: 68,
        y: 22,

        "text-anchor": "middle",

        fill: "#333333",

        "font-size": 14,

        "font-weight": "bold",

        "font-family": "Arial, sans-serif",

        "pointer-events": "none",
      },
      this.containerGroup_,
    );

    /**
     * ======================================================
     * NÚT +
     * ======================================================
     */

    this.plusGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {
        class: "time-stepper-plus",
      },
      this.containerGroup_,
    );

    this.plusRect_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {
        x: 105,
        y: 2,
        width: 32,
        height: 28,
        rx: 6,
        ry: 6,

        fill: "#eeeeee",

        stroke: "#cccccc",

        "stroke-width": 1,
      },
      this.plusGroup_,
    );

    this.plusText_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.TEXT,
      {
        x: 121,
        y: 23,

        "text-anchor": "middle",

        fill: "#333333",

        "font-size": 20,

        "font-weight": "bold",

        "font-family": "Arial, sans-serif",

        "pointer-events": "none",
      },
      this.plusGroup_,
    );

    this.plusText_.textContent = "+";

    /**
     * ======================================================
     * CURSOR
     * ======================================================
     */

    this.minusGroup_.style.cursor = "pointer";

    this.plusGroup_.style.cursor = "pointer";
  }

  /**
   * ========================================================
   * BIND EVENTS
   * ========================================================
   *
   * QUAN TRỌNG:
   *
   * Dùng Blockly.browserEvents.bind()
   * thay vì addEventListener().
   *
   * Blockly có hệ thống xử lý gesture riêng.
   */

  protected override bindEvents_() {
    /**
     * Cho Field xử lý event của chính nó trước.
     */

    super.bindEvents_();

    /**
     * ======================================================
     * NÚT -
     * ======================================================
     */

    if (this.minusGroup_) {
      this.minusEventData_ = Blockly.browserEvents.bind(
        this.minusGroup_,
        "mousedown",
        this,
        (event: Event) => {
          event.preventDefault();

          event.stopPropagation();

          this.changeTime_(-STEP_TIME);
        },
      );
    }

    /**
     * ======================================================
     * NÚT +
     * ======================================================
     */

    if (this.plusGroup_) {
      this.plusEventData_ = Blockly.browserEvents.bind(
        this.plusGroup_,
        "mousedown",
        this,
        (event: Event) => {
          event.preventDefault();

          event.stopPropagation();

          this.changeTime_(STEP_TIME);
        },
      );
    }

    /**
     * ======================================================
     * HOVER NÚT -
     * ======================================================
     */

    if (this.minusGroup_) {
      Blockly.browserEvents.bind(this.minusGroup_, "mouseenter", this, () => {
        if (this.timeValue_ > MIN_TIME) {
          this.minusRect_?.setAttribute("fill", "#dddddd");
        }
      });

      Blockly.browserEvents.bind(this.minusGroup_, "mouseleave", this, () => {
        this.updateStepperUI_();
      });
    }

    /**
     * ======================================================
     * HOVER NÚT +
     * ======================================================
     */

    if (this.plusGroup_) {
      Blockly.browserEvents.bind(this.plusGroup_, "mouseenter", this, () => {
        if (this.timeValue_ < MAX_TIME) {
          this.plusRect_?.setAttribute("fill", "#dddddd");
        }
      });

      Blockly.browserEvents.bind(this.plusGroup_, "mouseleave", this, () => {
        this.updateStepperUI_();
      });
    }
  }

  /**
   * ========================================================
   * THAY ĐỔI THỜI GIAN
   * ========================================================
   */

  private changeTime_(amount: number) {
    const newValue = TimeStepperField.normalize_(this.timeValue_ + amount);

    /**
     * Không vượt min / max
     */

    if (newValue === this.timeValue_) {
      return;
    }

    /**
     * Cập nhật Field
     */

    this.setValue(String(newValue));
  }

  /**
   * ========================================================
   * UPDATE VALUE
   * ========================================================
   */

  protected override doValueUpdate_(newValue: string) {
    const parsed = Number(newValue);

    const normalized = TimeStepperField.normalize_(parsed);

    /**
     * Blockly lưu giá trị
     */

    super.doValueUpdate_(String(normalized));

    /**
     * Lưu nội bộ
     */

    this.timeValue_ = normalized;

    /**
     * Cập nhật giao diện
     */

    this.updateStepperUI_();
  }

  /**
   * ========================================================
   * UPDATE UI
   * ========================================================
   */

  private updateStepperUI_() {
    /**
     * Giá trị
     */

    if (this.valueText_) {
      this.valueText_.textContent = `${this.timeValue_} ms`;
    }

    /**
     * ======================================================
     * NÚT -
     * ======================================================
     */

    const minusDisabled = this.timeValue_ <= MIN_TIME;

    if (this.minusRect_) {
      this.minusRect_.setAttribute(
        "fill",
        minusDisabled ? "#f5f5f5" : "#eeeeee",
      );

      this.minusRect_.setAttribute(
        "stroke",
        minusDisabled ? "#eeeeee" : "#cccccc",
      );
    }

    if (this.minusText_) {
      this.minusText_.setAttribute(
        "fill",
        minusDisabled ? "#bbbbbb" : "#333333",
      );
    }

    if (this.minusGroup_) {
      this.minusGroup_.style.cursor = minusDisabled ? "default" : "pointer";
    }

    /**
     * ======================================================
     * NÚT +
     * ======================================================
     */

    const plusDisabled = this.timeValue_ >= MAX_TIME;

    if (this.plusRect_) {
      this.plusRect_.setAttribute("fill", plusDisabled ? "#f5f5f5" : "#eeeeee");

      this.plusRect_.setAttribute(
        "stroke",
        plusDisabled ? "#eeeeee" : "#cccccc",
      );
    }

    if (this.plusText_) {
      this.plusText_.setAttribute("fill", plusDisabled ? "#bbbbbb" : "#333333");
    }

    if (this.plusGroup_) {
      this.plusGroup_.style.cursor = plusDisabled ? "default" : "pointer";
    }
  }

  /**
   * ========================================================
   * KHÔNG MỞ EDITOR
   * ========================================================
   */

  protected override showEditor_() {
    return;
  }

  /**
   * ========================================================
   * GET TEXT
   * ========================================================
   *
   * Generator nhận:
   *
   * 500
   * 600
   * 700
   */

  override getText(): string {
    return String(this.timeValue_);
  }

  /**
   * ========================================================
   * VALIDATION
   * ========================================================
   */

  override doClassValidation_(newValue?: string): string | null {
    if (newValue === undefined || newValue === "") {
      return null;
    }

    const value = Number(newValue);

    if (!Number.isFinite(value)) {
      return null;
    }

    return String(TimeStepperField.normalize_(value));
  }

  /**
   * ========================================================
   * SIZE
   * ========================================================
   */

  override updateSize_() {
    this.size_.width = 145;
    this.size_.height = 34;
  }
}

/**
 * =========================================================
 * REGISTER
 * =========================================================
 */

Blockly.fieldRegistry.register("time_stepper", TimeStepperField);

export default TimeStepperField;
