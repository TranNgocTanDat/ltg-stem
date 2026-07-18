export class BleEvents {
  private target = new EventTarget();

  emit(name: string, detail?: unknown) {
    this.target.dispatchEvent(
      new CustomEvent(name, { detail })
    );
  }

  on<T = unknown>(
    name: string,
    callback: (detail: T) => void
  ) {
    const handler = (event: Event) => {
      callback((event as CustomEvent).detail);
    };

    this.target.addEventListener(name, handler);

    return () => {
      this.target.removeEventListener(name, handler);
    };
  }
}