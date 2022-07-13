import {
  ObservableValue,
  ReadonlyObservableValue,
} from "../hex/observable_value";

export interface TimelineItem<T> {
  id: string;
  // Scalar position between 0 and 1
  location: number;
  value: T;
  label: string;
  priority: number;
}

interface AbsoluteItem<T> extends TimelineItem<T> {
  positionCenter: number;
  positionLeft: number;
  positionRight: number;
}

export interface TimelineDomainPort<T> {
  items: TimelineItem<T>[];
  itemWidth: number;
  initialTimelineWidth?: number;
  priorityList: number[];
}

export class TimelineDomain<T> {
  private items: ObservableValue<TimelineItem<T>[]>;
  private itemWidth: ObservableValue<number>;
  private visibleItems: ObservableValue<TimelineItem<T>[]>;
  private totalWidth: ObservableValue<number>;
  private priorityList: ObservableValue<number[]>;

  constructor({
    items,
    itemWidth,
    initialTimelineWidth,
    priorityList,
  }: TimelineDomainPort<T>) {
    this.items = new ObservableValue(items);
    this.itemWidth = new ObservableValue(itemWidth);
    this.visibleItems = new ObservableValue<TimelineItem<T>[]>([]);
    this.totalWidth = new ObservableValue(initialTimelineWidth ?? 1);
    this.priorityList = new ObservableValue(priorityList);
  }

  addItem(item: TimelineItem<T>) {
    this.items.transformValue((old) => [...old, item]);
    this.filterVisibleItems();
  }

  deleteItem(id: string) {
    this.items.transformValue((old) => old.filter((item) => item.id !== id));
    this.filterVisibleItems();
  }

  setTotalWidth(value: number) {
    this.totalWidth.setValue(value);
    this.filterVisibleItems();
  }

  private filterVisibleItems() {
    const width = this.totalWidth.getValue();
    const itemWidth = this.itemWidth.getValue();
    const positionedItems: AbsoluteItem<T>[] = this.items
      .getValue()
      .map((i) => ({
        ...i,
        positionCenter: width * i.location,
        positionLeft: width * i.location - itemWidth / 2,
        positionRight: width * i.location + itemWidth / 2,
      }));

    let visibleItems: AbsoluteItem<T>[] = [];

    const priorityList = this.priorityList.getValue();
    for (let i = 0; i < priorityList.length; i += 1) {
      const priority = priorityList[i];
      const priorityItems = positionedItems.filter(
        (item) => item.priority === priority
      );
      if (i === 0 || this.isPriorityLayerVisible(priorityItems, visibleItems)) {
        visibleItems = visibleItems.concat(priorityItems);
      } else {
        break;
      }
    }

    this.visibleItems.setValue(visibleItems);
  }

  private isPriorityLayerVisible(
    layer: AbsoluteItem<T>[],
    visibleItems: AbsoluteItem<T>[]
  ) {
    for (let i = 0; i < layer.length; i += 1) {
      const layerItem = layer[i];

      for (let j = 0; j < visibleItems.length; j += 1) {
        const visibleItem = visibleItems[j];

        if (
          this.doesRangeOverlap({
            leftFirst: visibleItem.positionLeft,
            rightFirst: visibleItem.positionRight,
            leftSecond: layerItem.positionLeft,
            rightSecond: layerItem.positionRight,
          })
        ) {
          return false;
        }
      }
    }

    return true;
  }

  private doesRangeOverlap(ranges: {
    leftFirst: number;
    rightFirst: number;
    leftSecond: number;
    rightSecond: number;
  }) {
    return (
      this.isInRange(ranges.leftFirst, ranges.leftSecond, ranges.rightSecond) ||
      this.isInRange(ranges.rightFirst, ranges.leftSecond, ranges.rightSecond)
    );
  }

  private isInRange(val: number, left: number, right: number) {
    return val >= left && val <= right;
  }

  get itemsBroadcast(): ReadonlyObservableValue<TimelineItem<T>[]> {
    return this.items;
  }
  get itemWidthBroadcast(): ReadonlyObservableValue<number> {
    return this.itemWidth;
  }
  get visibleItemsBroadcast(): ReadonlyObservableValue<TimelineItem<T>[]> {
    return this.visibleItems;
  }
  get totalWidthBroadcast(): ReadonlyObservableValue<number> {
    return this.totalWidth;
  }
  get priorityListBroadcast(): ReadonlyObservableValue<number[]> {
    return this.priorityList;
  }

  dispose() {
    this.items.dispose();
    this.itemWidth.dispose();
    this.visibleItems.dispose();
    this.totalWidth.dispose();
    this.priorityList.dispose();
  }
}
