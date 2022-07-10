import { nanoid } from "nanoid";

export class ObservableValue<T> {
  private value: T;
  private callbacks: Record<string, (v: T) => void>;

  constructor(initialValue: T) {
    this.value = initialValue;
    this.callbacks = {};
  }

  getValue() {
    return this.value;
  }

  onChange(callback: (v: T) => void) {
    const id = nanoid();
    this.callbacks[id] = callback;
    return () => this.unsubscribe(id);
  }

  setValue(newValue: T) {
    this.value = newValue;
    Object.values(this.callbacks).forEach((callback) => callback(this.value));
  }

  transformValue(transform: (v: T) => T) {
    this.setValue(transform(this.value));
  }

  unsubscribe(id: string) {
    if (Object.keys(this.callbacks).find((key) => key === id)) {
      delete this.callbacks[id];
    }
  }

  dispose() {
    this.callbacks = {};
  }
}
