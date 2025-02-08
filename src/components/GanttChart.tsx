import React, { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string;
}

interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const ganttRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ganttRef.current && tasks.length > 0) {
      new Gantt(ganttRef.current, tasks, {
        view_mode: "Week",
        on_click: (task: Task) => alert(`Clicked on ${task.name}`),
      });
    }
  }, [tasks]);

  return <div ref={ganttRef}></div>;
};

export default GanttChart;
