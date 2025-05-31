"use client";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { useSortable, arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StockChart from "./StockChart";
import Fundamentals from "./Fundamentals";

// Both widgets expect 'symbol' prop (string)
const widgetMap: Record<string, React.ComponentType<{ symbol: string }>> = {
  Chart: StockChart,
  Fundamentals: Fundamentals,
};

const defaultWidgets = ["Chart", "Fundamentals"];

export default function CustomDashboard({ stock }: { stock: { symbol: string } }) {
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
              <SortableWidget key={name} id={name} symbol={stock.symbol} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableWidget({ id, symbol }: { id: string; symbol: string }) {
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
      <Widget symbol={symbol} />
    </div>
  );
}
