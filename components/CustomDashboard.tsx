"use client";
import { useState } from "react";
// Fix: DndContext comes from @dnd-kit/core, rest from @dnd-kit/sortable
import { DndContext } from "@dnd-kit/core";
import { useSortable, arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StockChart from "./StockChart";
import Fundamentals from "./Fundamentals";

const widgetMap: Record<string, React.ComponentType<{ stock: any }>> = {
  Chart: StockChart,
  Fundamentals: Fundamentals,
};

const defaultWidgets = ["Chart", "Fundamentals"];

export default function CustomDashboard({ stock }: { stock: any }) {
  const [widgets, setWidgets] = useState(defaultWidgets);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-saffron">Custom Dashboard</h1>
      <DndContext
        onDragEnd={({ active, over }) => {
          if (active.id && over?.id && active.id !== over.id) {
            setWidgets((items) => arrayMove(
              items,
              items.indexOf(active.id as string),
              items.indexOf(over.id as string)
            ));
          }
        }}
      >
        <SortableContext items={widgets} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-6">
            {widgets.map((name) => (
              <SortableWidget key={name} id={name} stock={stock} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableWidget({ id, stock }: { id: string, stock: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const Widget = widgetMap[id];
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
      }}
      className="bg-card dark:bg-darkcard shadow-card rounded-xl p-4 w-80"
    >
      <Widget stock={stock} />
    </div>
  );
}
