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
import { useGetElection } from "@/data/electionsClient";

function SortableItem({ candidate, onClick }: { candidate: ElectionCandidate, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    color: "black",
  };

  return (
    <li>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-2 bg-gray-200 rounded-lg cursor-grab"
      >
        {candidate.name}
      </div>

      <div onClick={onClick}>
        ❌
      </div>
    </li>
  );
}

export default function Vote() {
  const { election, loading, error } = useGetElection()
  const [items, setItems] = useState<ElectionCandidate[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const itemIds = items.map(it => it.id)

    if (active.id !== over?.id) {
      const oldIndex = itemIds.indexOf(active.id as string);
      const newIndex = itemIds.indexOf(over?.id as string);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const removeSelecteditem = (id: string) => {
    console.log(items.filter((it) => it.id != id))
    setItems(items.filter((it) => it.id != id))
  }

  const onAddCandidateToRankingList = (item: ElectionCandidate) => {
    if (items.some(c => c.id === item.id)) {
      return
    }
    setItems([...items, item])
  }

  if (error !== null) {
    return (
      <div>
        <h3>Hmmn we can&apos;t find that election 🤔</h3>
        <h4>{error}</h4>
      </div>
    )
  } else if (election !== null) {
    return (
      <div className="grid items-center justify-items-center">
        <main className="flex flex-col items-left">

          <ul>
            {[...election.candidates].map(item => (
              <li onClick={() => onAddCandidateToRankingList(item)} key={item.id}>{item.name}</li>
            ))}
          </ul>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2 p-4 border rounded-lg">
                {items.map(c => (
                  <SortableItem key={c.id} candidate={c} onClick={() => removeSelecteditem(c.id)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <button onClick={() => console.log("Voting! in " + election.id)}>
            Cast Vote!
          </button>
        </main>
      </div>
    )
  } else if (loading !== null) {
    return (
      <CircularProgress />
    )
  }
}