import * as Blockly from "blockly";

export class TimeField extends Blockly.Field {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override value_: any = 1;

  private readonly step = 0.1;
  private readonly min = 0.1;
  private readonly max = 60;

  private minusText?: SVGTextElement;
  private plusText?: SVGTextElement;

  constructor(value = 1) {
    super(String(value));

    this.value_ = this.normalize(value);
    this.setValue(String(this.value_));
  }

  private normalize(value: number | string): number {
    const num = Number(value);

    if (Number.isNaN(num)) {
      return 1;
    }

    const rounded = Math.round(num / this.step) * this.step;

    return Math.min(
      this.max,
      Math.max(this.min, Number(rounded.toFixed(1))),
    );
  }

  getValue(): string {
    return String(this.value_);
  }

  setValue(value: string) {
    this.value_ = this.normalize(value);

    super.setValue(String(this.value_));

    this.updateDisplay();
  }

  private increase() {
    this.setValue(String(this.value_ + this.step));
  }

  private decrease() {
    this.setValue(String(this.value_ - this.step));
  }

  protected initView() {
    super.initView();

    if (!this.fieldGroup_) return;

    // Xóa nội dung mặc định
    while (this.fieldGroup_.firstChild) {
      this.fieldGroup_.removeChild(
        this.fieldGroup_.firstChild,
      );
    }

    // Background
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const background = Blockly.utils.dom.createSvgElement(
      "rect",
      {
        x: 0,
        y: 0,
        width: 80,
        height: 32,
        rx: 6,
        ry: 6,
        fill: "#ffffff",
        stroke: "#cccccc",
        "stroke-width": 1,
      },
      this.fieldGroup_,
    );

    // Nút -
    this.minusText = Blockly.utils.dom.createSvgElement(
      "text",
      {
        x: 14,
        y: 21,
        "text-anchor": "middle",
        "font-size": 18,
        "font-weight": "bold",
        cursor: "pointer",
        fill: "#555",
      },
      this.fieldGroup_,
    );

    this.minusText.textContent = "−";

    // Giá trị
    this.textElement_ = Blockly.utils.dom.createSvgElement(
      "text",
      {
        x: 40,
        y: 20,
        "text-anchor": "middle",
        "font-size": 13,
        "font-weight": "600",
        fill: "#222",
      },
      this.fieldGroup_,
    );

    // Nút +
    this.plusText = Blockly.utils.dom.createSvgElement(
      "text",
      {
        x: 66,
        y: 21,
        "text-anchor": "middle",
        "font-size": 18,
        "font-weight": "bold",
        cursor: "pointer",
        fill: "#555",
      },
      this.fieldGroup_,
    );

    this.plusText.textContent = "+";

    // Click -
    Blockly.browserEvents.bind(
      this.minusText,
      "mousedown",
      this,
      (event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        this.decrease();
      },
    );

    // Click +
    Blockly.browserEvents.bind(
      this.plusText,
      "mousedown",
      this,
      (event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        this.increase();
      },
    );

    this.updateDisplay();
  }

  private updateDisplay() {
    if (!this.textElement_) return;

    this.textElement_.textContent = this.value_.toFixed(1);
  }

  getText(): string {
    return this.value_.toFixed(1);
  }

  updateSize_() {
    this.size_.width = 80;
    this.size_.height = 32;
  }
}