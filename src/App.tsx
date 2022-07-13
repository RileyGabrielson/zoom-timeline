import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Timeline } from "./timeline/timeline";
import { TimelineItem } from "./timeline/timeline_domain";

const testItems: TimelineItem<number>[] = [
  { id: "1", location: 0.15, value: 1, label: "First", priority: 2 },
  { id: "2", location: 0.2, value: 2, label: "Second", priority: 1 },
  { id: "3", location: 0.8, value: 3, label: "Third", priority: 2 },
];

function App() {
  return (
    <div>
      <Timeline
        port={{ items: testItems, itemWidth: 0.25, priorityList: [2, 1] }}
      />
    </div>
  );
}

export default App;
