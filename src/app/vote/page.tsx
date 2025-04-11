"use client";
import { Suspense, useState } from "react";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
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
import { ElectionCandidate } from "@/data/model/models";
import { sendVote, useGetElection } from "@/data/electionsClient";

function Remove(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        fill: 'rgba(255, 70, 70, 0.95)',
        padding: "8px"
      }}
    >
      <svg width="8" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.99998 -0.000206962C2.7441 -0.000206962 2.48794 0.0972617 2.29294 0.292762L0.292945 2.29276C-0.0980552 2.68376 -0.0980552 3.31682 0.292945 3.70682L7.58591 10.9998L0.292945 18.2928C-0.0980552 18.6838 -0.0980552 19.3168 0.292945 19.7068L2.29294 21.7068C2.68394 22.0978 3.31701 22.0978 3.70701 21.7068L11 14.4139L18.2929 21.7068C18.6829 22.0978 19.317 22.0978 19.707 21.7068L21.707 19.7068C22.098 19.3158 22.098 18.6828 21.707 18.2928L14.414 10.9998L21.707 3.70682C22.098 3.31682 22.098 2.68276 21.707 2.29276L19.707 0.292762C19.316 -0.0982383 18.6829 -0.0982383 18.2929 0.292762L11 7.58573L3.70701 0.292762C3.51151 0.0972617 3.25585 -0.000206962 2.99998 -0.000206962Z" />
      </svg>
    </button>
  );
}

function SortableItem({ candidate, onClick }: { candidate: ElectionCandidate, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: candidate.id }, );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    color: "black",
  };

  return (
    <li>
      <div
        ref={setNodeRef}
        style={{...style, display: "flex"}}
        {...attributes}
        {...listeners}
        className="p-2 bg-gray-200 rounded-lg cursor-grab"
      >
        <span style={{flex: 1}}>
          {candidate.name}
        </span>

        <span>
          <Remove onClick={() => {
            console.log("Removing!")
            onClick()
          }}/>
        </span>
      </div>
    </li>
  );
}

function VoteScreen() {
  const { election, loading, error } = useGetElection()
  const [items, setItems] = useState<ElectionCandidate[]>([]);
  const [submissionState, setSubmissionState] = useState<boolean | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint:{distance:10}}),
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

  const castVote = async () => {
    const electionId = election?.id
    if (electionId === undefined) {
      return
    }
    const response = await sendVote(electionId, items)
    setSubmissionState(response.ok)
  }

  if (submissionState === true) {
    return (
      <div>
        <h3>Your ballot was submitted successfully ✅</h3>
      </div>
    )
  } else if (error !== null) {
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

          {
            (submissionState === false) ? (<h3>There was a problem submitting youre ballot. Try again.</h3>) : <></>
          }

          <ul>
            {[...election.candidates].map(item => (
              <li onClick={() => onAddCandidateToRankingList(item)} key={item.id}>{item.name}</li>
            ))}
          </ul>

          {(loading === true) ? <CircularProgress /> : <></>}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2 p-4 border rounded-lg">
                {items.map(c => (
                  <SortableItem key={c.id} candidate={c} onClick={() => removeSelecteditem(c.id)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <button onClick={castVote}>
            Cast Vote!
          </button>
        </main>
      </div>
    )
  }
}

export default function Vote() {
    return (
    <Suspense>
      <VoteScreen />
    </Suspense>
  )
}