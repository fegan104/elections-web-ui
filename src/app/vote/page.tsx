"use client"; // Ensures this runs only on the client side
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CircularProgress from '@mui/material/CircularProgress';

const initialItems = ["SPD", "Z", "NSDAP", "DVU", "KPD", "DNVP"];

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    color: "black",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-gray-200 rounded-lg cursor-grab"
    >
      {id}
    </li>
  );
}

type Result<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'failure'; error: string };

const Loading: Result<string> = { status: 'loading' }

export default function Vote() {
  const [electionId, setElectionId] = useState<Result<string>>(Loading);
  const [items, setItems] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over?.id as string);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    const parsedId = window.location.hash.slice(2);//remove leading "#/"
    if (parsedId.length > 1) {
      setElectionId({ status: "success", data: parsedId });
    } else {
      setElectionId({ status: "failure", error: "Invalid electionid" });
    }
  }, []);

  if (electionId.status === 'failure') {
    return (
      <h3>Hmmn we can&apos;t find that election 🤔</h3>
    )
  } else if (electionId.status === 'loading') {
    return (
      <CircularProgress />
    )
  } else if (electionId.status === 'success') {
    return (
      <div className="grid items-center justify-items-center">
        <main className="flex flex-col items-left">

          <ul>
            {initialItems.map((item, index) => (
              <li onClick={() => setItems([...items, item])} key={index}>{item}</li>
            ))}
          </ul>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2 p-4 border rounded-lg">
                {items.map((id) => (
                  <SortableItem key={id} id={id} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <button onClick={() => console.log("Voting! in " + electionId)}>
            Cast Vote!
          </button>
        </main>
      </div>
    )
  }
}