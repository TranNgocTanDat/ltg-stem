
import * as Blockly from "blockly";

/**
 * =========================================================
 * CẤU HÌNH TỐC ĐỘ
 * =========================================================
 */

const DEFAULT_SPEED = 80;
const MIN_SPEED = 0;
const MAX_SPEED = 100;
const STEP_SPEED = 1;

/**
 * =========================================================
 * SPEED STEPPER FIELD
 * =========================================================
 *
 * Giao diện:
 *
 *     [ − ]  80  [ + ]
 *
 * Giá trị tốc độ từ 0 đến 100.
 * Mỗi lần nhấn +/- thay đổi 5 đơn vị.
 * Không popup.
 */

class SpeedStepperField extends Blockly.Field<string> {
  private speedValue_: number;

  private containerGroup_?: SVGGElement;

  private minusGroup_?: SVGGElement;
  private plusGroup_?: SVGGElement;

  private minusRect_?: SVGRectElement;
  private plusRect_?: SVGRectElement;

  private minusText_?: SVGTextElement;
  private plusText_?: SVGTextElement;

  private valueText_?: SVGTextElement;

  private minusEventData_?: Blockly.browserEvents.Data;
  private plusEventData_?: Blockly.browserEvents.Data;

  constructor(value: number = DEFAULT_SPEED) {
    const normalized = SpeedStepperField.normalize_(value);

    super(String(normalized));

    this.speedValue_ = normalized;
  }

  /**
   * ========================================================
   * CHUẨN HÓA GIÁ TRỊ
   * ========================================================
   */

  private static normalize_(value: number): number {
    if (!Number.isFinite(value)) {
      return DEFAULT_SPEED;
    }

    return Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
  }

  /**
   * ========================================================
   * INIT VIEW
   * ========================================================
   */

  protected override initView() {
    super.initView();

    // Ẩn text mặc định của Blockly.
    if (this.textElement_) {
      this.textElement_.style.display = "none";
    }

    this.createStepperUI_();
    this.updateStepperUI_();
  }

  /**
   * ========================================================
   * TẠO GIAO DIỆN
   * ========================================================
   */

  private createStepperUI_() {
    if (!this.fieldGroup_) {
      return;
    }

    this.containerGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {},
      this.fieldGroup_,
    );

    // Nút giảm tốc độ.
    this.minusGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      { class: "speed-stepper-minus" },
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

    // Giá trị tốc độ hiện tại.
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

    // Nút tăng tốc độ.
    this.plusGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      { class: "speed-stepper-plus" },
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

    this.minusGroup_.style.cursor = "pointer";
    this.plusGroup_.style.cursor = "pointer";
  }

  /**
   * ========================================================
   * GẮN SỰ KIỆN
   * ========================================================
   */

  protected override bindEvents_() {
    super.bindEvents_();

    // Nút giảm tốc độ.
    if (this.minusGroup_) {
      this.minusEventData_ = Blockly.browserEvents.bind(
        this.minusGroup_,
        "mousedown",
        this,
        (event: Event) => {
          event.preventDefault();
          event.stopPropagation();

          this.changeSpeed_(-STEP_SPEED);
        },
      );

      Blockly.browserEvents.bind(
        this.minusGroup_,
        "mouseenter",
        this,
        () => {
          if (this.speedValue_ > MIN_SPEED) {
            this.minusRect_?.setAttribute("fill", "#dddddd");
          }
        },
      );

      Blockly.browserEvents.bind(
        this.minusGroup_,
        "mouseleave",
        this,
        () => {
          this.updateStepperUI_();
        },
      );
    }

    // Nút tăng tốc độ.
    if (this.plusGroup_) {
      this.plusEventData_ = Blockly.browserEvents.bind(
        this.plusGroup_,
        "mousedown",
        this,
        (event: Event) => {
          event.preventDefault();
          event.stopPropagation();

          this.changeSpeed_(STEP_SPEED);
        },
      );

      Blockly.browserEvents.bind(
        this.plusGroup_,
        "mouseenter",
        this,
        () => {
          if (this.speedValue_ < MAX_SPEED) {
            this.plusRect_?.setAttribute("fill", "#dddddd");
          }
        },
      );

      Blockly.browserEvents.bind(
        this.plusGroup_,
        "mouseleave",
        this,
        () => {
          this.updateStepperUI_();
        },
      );
    }
  }

  /**
   * ========================================================
   * THAY ĐỔI TỐC ĐỘ
   * ========================================================
   */

  private changeSpeed_(amount: number) {
    const newValue = SpeedStepperField.normalize_(
      this.speedValue_ + amount,
    );

    if (newValue === this.speedValue_) {
      return;
    }

    this.setValue(String(newValue));
  }

  /**
   * ========================================================
   * CẬP NHẬT GIÁ TRỊ
   * ========================================================
   */

  protected override doValueUpdate_(newValue: string) {
    const parsed = Number(newValue);
    const normalized = SpeedStepperField.normalize_(parsed);

    super.doValueUpdate_(String(normalized));

    this.speedValue_ = normalized;

    this.updateStepperUI_();
  }

  /**
   * ========================================================
   * CẬP NHẬT GIAO DIỆN
   * ========================================================
   */

  private updateStepperUI_() {
    if (this.valueText_) {
      this.valueText_.textContent = String(this.speedValue_);
    }

    // Nút giảm.
    const minusDisabled = this.speedValue_ <= MIN_SPEED;

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
      this.minusGroup_.style.cursor = minusDisabled
        ? "default"
        : "pointer";
    }

    // Nút tăng.
    const plusDisabled = this.speedValue_ >= MAX_SPEED;

    if (this.plusRect_) {
      this.plusRect_.setAttribute(
        "fill",
        plusDisabled ? "#f5f5f5" : "#eeeeee",
      );

      this.plusRect_.setAttribute(
        "stroke",
        plusDisabled ? "#eeeeee" : "#cccccc",
      );
    }

    if (this.plusText_) {
      this.plusText_.setAttribute(
        "fill",
        plusDisabled ? "#bbbbbb" : "#333333",
      );
    }

    if (this.plusGroup_) {
      this.plusGroup_.style.cursor = plusDisabled
        ? "default"
        : "pointer";
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
   * Generator nhận giá trị:
   * 0, 5, 10, ..., 80, ..., 100
   */

  override getText(): string {
    return String(this.speedValue_);
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

    return String(SpeedStepperField.normalize_(value));
  }

  /**
   * ========================================================
   * KÍCH THƯỚC
   * ========================================================
   */

  override updateSize_() {
    this.size_.width = 145;
    this.size_.height = 34;
  }
}

/**
 * =========================================================
 * ĐĂNG KÝ FIELD
 * =========================================================
 */

Blockly.fieldRegistry.register("speed_stepper", SpeedStepperField);

export default SpeedStepperField;
