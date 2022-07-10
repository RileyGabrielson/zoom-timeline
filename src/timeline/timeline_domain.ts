import { ObservableValue } from "../hex/observable_value";

export interface TimelineItem<T> {
  id: string;
  // Scalar position between 0 and 1
  position: number;
  value: T;
  label: string;
  priority: number;
}

interface AbsoluteItem<T> extends TimelineItem<T> {
  positionLeft: number;
  positionRight: number;
}

export interface TimelinePort<T> {
  items: TimelineItem<T>[];
  itemWidth: number;
  initialTimelineWidth?: number;
}

export class TimelineDomain<T> {
  items: ObservableValue<TimelineItem<T>[]>;
  itemWidth: ObservableValue<number>;
  visibleItems: ObservableValue<TimelineItem<T>[]>;
  totalWidth: ObservableValue<number>;

  constructor({ items, itemWidth, initialTimelineWidth }: TimelinePort<T>) {
    this.items = new ObservableValue(items);
    this.itemWidth = new ObservableValue(itemWidth);
    this.visibleItems = new ObservableValue<TimelineItem<T>[]>([]);
    this.totalWidth = new ObservableValue(initialTimelineWidth ?? 1);
  }

  addItem(item: TimelineItem<T>) {
    this.items.transformValue((old) => [...old, item]);
  }

  deleteItem(id: string) {
    this.items.transformValue((old) => old.filter((item) => item.id !== id));
  }

  private filterVisibleItems() {
    const positionedItems: AbsoluteItem<T>[] = this.items
      .getValue()
      .map((i) => ({ ...i, positionLeft: 0, positionRight: 0 }));
  }

  private isItemVisible(item: TimelineItem<T>) {
    const width = this.totalWidth.getValue();
    const absoluteItemPosition = width * item.position;
    const leftEdge = absoluteItemPosition - this.itemWidth.getValue();
    const rightEdge = absoluteItemPosition + this.itemWidth.getValue();

    let isVisible = true;

    return isVisible;
  }

  private isInRange(val: number, left: number, right: number) {
    return val >= left && val <= right;
  }
}
