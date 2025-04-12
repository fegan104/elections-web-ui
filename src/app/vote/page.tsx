"use client";
import { Suspense, useState } from "react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
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
import { TonalButton } from "@/components/Buttons";

function Remove(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="px-1" {...props}>
      ❌
    </button>
  );
}

function SortableItem({ candidate, onClick }: { candidate: ElectionCandidate, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: candidate.id },);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    color: "black",
  };

  return (
    <li>
      <div
        ref={setNodeRef}
        style={{ ...style, display: "flex", touchAction: "none" }}
        {...attributes}
        {...listeners}
        className="p-2 bg-gray-200 rounded-lg cursor-grab gap-2"
      >
        <span style={{ flex: 1 }}>
          {candidate.name}
        </span>

        <span>
          <Remove onClick={onClick} />
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
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
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
        <main className="flex gap-8">

          {
            (submissionState === false) ? (<h3>There was a problem submitting youre ballot. Try again.</h3>) : <></>
          }

          <div className="space-y-2">
            <h4>Available Candidates</h4>
            <ul className="space-y-2 p-4 border rounded-lg">
              {[...election.candidates].map(item => (
                <li className={`${items.some(c => c.id === item.id) ? "bg-green-300 rounded-md px-2 py-1" : ""}`} onClick={() => onAddCandidateToRankingList(item)} key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>

          {(loading === true) ? <CircularProgress /> : <></>}

          <div className="flex flex-col items-center space-y-2">

            <h4>Your Ballot</h4>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2 p-4 border rounded-lg max-w-[250px]">
                  {(items.length == 0) ? <span className="font-medium text-sm">Select the candidates you wish to rank on the left hand side.</span> : <></>}

                  {items.map(c => (
                    <SortableItem key={c.id} candidate={c} onClick={() => removeSelecteditem(c.id)} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>

            <TonalButton onClick={castVote}>
              Cast Vote!
            </TonalButton>
          </div>
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