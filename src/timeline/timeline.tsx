import React, { CSSProperties, useState } from "react";
import { useAsyncValue } from "../hex/use_async_value";
import { TimelineDomain, TimelineItem } from "./timeline_domain";

export interface TimelinePort<T> {
  items: TimelineItem<T>[];
  itemWidth: number;
  initialTimelineWidth?: number;
  priorityList: number[];
}

export interface TimelineProps<T> {
  port: TimelinePort<T>;
  style?: CSSProperties;
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
    height: "100px",
  },
  bar: {
    position: "absolute",
    top: "50%",
    height: 3,
    width: "100%",
    backgroundColor: "black",
  },
};

export function Timeline<T>({ port, style }: TimelineProps<T>) {
  const [domain] = useState(() => new TimelineDomain(port));
  const visibleItems = useAsyncValue(domain.visibleItemsBroadcast);

  return (
    <div style={{ ...styles.root, ...style }}>
      <div style={styles.bar} />
    </div>
  );
}
