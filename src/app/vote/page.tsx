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
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CircularProgress from "@/components/CircularProgress";
import { ElectionCandidate } from "@/data/model/models";
import { sendVote, useGetElection } from "@/data/electionsClient";
import { TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import useFirebaseUser from "@/data/useFirebaseUser";
import { analyticsEvents } from "@/data/firebaseClient";
import Link from "next/link";
import { User } from "firebase/auth";
import CandidateNameListItem from "@/components/CandidateNameListItem";

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
  const electionResultState = useGetElection()
  const { status, user } = useFirebaseUser()
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
      removeSelecteditem(item.id)
      return
    }
    setItems([...items, item])
  }

  const castVote = async () => {
    if (electionResultState.state != "success") {
      return
    }
    const electionId = electionResultState.election.id
    if (electionId === undefined) {
      return
    }
    const response = await sendVote(electionId, items)
    setSubmissionState(response.ok)
    if (response.ok) {
      analyticsEvents.trackVote()
    }
  }

  if (submissionState === true) {
    return (
      <div className="flex justify-center">
        <h3>Your ballot was submitted successfully ✅</h3>
      </div>
    )
  }

  if (electionResultState.state == "loading") {
    return (<CircularProgress />)
  }

  if (electionResultState.state == "error") {
    return (
      <div>
        <h3 className="flex justify-center">Hmmn we can&apos;t find that election 🤔</h3>
      </div>
    )
  }

  if (electionResultState.state == "success") {
    return (
      <div className="space-y-2">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-fill md:w-fit">
            
            {CandidateNamesCard(electionResultState.election.candidates, items, onAddCandidateToRankingList)}


            {BallotCard(sensors, handleDragEnd, items, removeSelecteditem, status, castVote, user)}
          </div>

        </div>
        <div className={`flex justify-center ${(submissionState === false) ? "" : "hidden"}`}>
          There was a problem submitting youre ballot. Try again.
        </div>
      </div>
    )
  }
}

function BallotCard(
  sensors: SensorDescriptor<SensorOptions>[], 
  handleDragEnd: (event: DragEndEvent) => void, 
  items: ElectionCandidate[], 
  removeSelecteditem: (id: string) => void, 
  status: string, 
  castVote: () => Promise<void>, 
  user: User | null,
) {
  return <div className="flex flex-col items-center w-[256px]">
    <Card className="space-y-2 h-full w-full">
      <h4>Your Ballot</h4>

      <div className="p-4 border rounded-lg w-full">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {(items.length == 0) ? <span className="font-medium text-sm">Select the candidates you wish to rank from the list of Available Candidates.</span> : <></>}
            <ul className="space-y-2">
              {items.map(c => (
                <SortableItem key={c.id} candidate={c} onClick={() => removeSelecteditem(c.id)} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      <div className={`${(status === 'unauthenticated') ? "" : "hidden"}`}>
        <p className="font-medium text-sm my-2">You must be signed in to cast a ballot.</p>
        <Link passHref href="/sign-up">
          <TonalButton className="w-full">Create an Account</TonalButton>
        </Link>
      </div>

      <TonalButton className={`w-full ${(status === 'authenticated') ? "" : "hidden"}`} onClick={castVote} disabled={(user == null) || (items.length == 0)}>
        Cast Vote
      </TonalButton>
    </Card>
  </div>;
}

function CandidateNamesCard(candidates: ElectionCandidate[], items: ElectionCandidate[], onAddCandidateToRankingList: (item: ElectionCandidate) => void) {
  return <div className="w-[256px]">
    <Card className="flex-col space-y-2 w-full">
      <h4>Available Candidates</h4>
      <ul className="space-y-2 p-4 border rounded-lg w-full">
        {candidates.map(item => (
          <CandidateNameListItem
            key={item.id}
            className={`${items.some(c => c.id === item.id) ? "bg-green-300 rounded-md" : ""}`} 
            candidateName={item.name}
            onClick={() => onAddCandidateToRankingList(item)}
          />
        ))}
      </ul>
    </Card>
  </div>;
}

export default function Vote() {
  return (
    <Suspense>
      <VoteScreen />
    </Suspense>
  )
}