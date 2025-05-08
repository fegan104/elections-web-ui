"use client"
import { TextButton, TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { useGetElectionWinners, useShareableVotingUrl } from "@/data/electionsClient";
import { analyticsEvents } from "@/data/firebaseClient";
import { ElectionWinnersResponse, VoteCountingRound } from "@/data/model/models";
import CircularProgress from "@/components/CircularProgress";
import { forwardRef, Ref, Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";

export default function ViewResults() {

  return (
    <Suspense>
      <ViewResultsScreen />
    </Suspense>
  )
}

function ViewResultsScreen() {
  const [numWinners, setNumWinners] = useState(1)
  const { response, closeElection, loading, error } = useGetElectionWinners(numWinners)

  const handleCloseElection = async () => {
    closeElection(1)
  }

  return (
    <div>
      {loading ? <CircularProgress /> : <></>}
      {error ? (<h3> {error} </h3>) : <></>}
      {response != null ? (
        <ElectionResults
          data={response}
          onCloseElection={handleCloseElection}
          numWinners={numWinners}
          onUpdateNumWinners={setNumWinners} />
      ) : <></>}
    </div>
  )
}

interface ElectionResultsProps {
  data: ElectionWinnersResponse;
  onCloseElection: () => void;
  numWinners: number;
  onUpdateNumWinners: (winners: number) => void;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({ data, onCloseElection, numWinners, onUpdateNumWinners }) => {
  const dialogRef = useRef<ShareDialogRef>(null);
  const { election, voters, voteCountingResponse } = data
  const [rawNumWinners, setRawNumWinners] = useState(numWinners.toString())
  const shareableVotingUrl = useShareableVotingUrl(election)


  const onShareVotingLink = () => {
    dialogRef.current?.open()
  }

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      <Card className="w-fit max-w-[512px]">
        <div className="p-3 space-y-2 w-fit">
          <h2 className="text-lg font-bold">Results for {election.name}</h2>

          <div>
            <span className="text-base font-bold">Status: </span>
            <span className="text-base">{election.isOpen ? "Open" : "Closed"}</span>
          </div>

          <div>
            <h4 className="font-bold">Candidates</h4>
            <ul className="list-disc list-inside my-1">
              {election.candidates.map((candidate) => (
                <li key={candidate.id} className="text-sm">
                  {candidate.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Voters: {voters.length} total vote(s)</h4>
            <ul className="list-disc list-inside gap-4">
              {voters.map((voter) => (
                <li key={voter.id} className="text-sm">
                  {voter.name === "" ? `Anonymous (${voter.id})` : voter.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Section for closed election with winners */}
          <div className={`${voteCountingResponse == null ? "hidden" : ""}`}>
            <div className="mb-4">
              <h3 className="font-semibold">Winners:</h3>
              <ul className="list-disc list-inside">
                {voteCountingResponse?.winners.map((winner) => (
                  <li key={winner.candidate.id}>
                    {winner.candidate.name} — {new Intl.NumberFormat("en-US").format(winner.votes)} votes
                  </li>
                ))}
              </ul>
            </div>

            <p className="mb-4">Exhausted votes: {voteCountingResponse?.exhausted}</p>

            <div className="mt-2 space-y-2">
              <h2 className="text-lg font-bold">Details</h2>
              <p className="text-sm">{`These are the results for the top ${numWinners} candidates. Would you like to find the results for another number of winners?`}</p>
              <TextInput label="Alternative Number of Winners" type="number" value={rawNumWinners} onChange={(entry) => {
                setRawNumWinners(entry)
              }}
              />
              <TonalButton className="w-full" disabled={isNaN(parseInt(rawNumWinners))} onClick={() => {
                if (!isNaN(parseInt(rawNumWinners))) {
                  onUpdateNumWinners(parseInt(rawNumWinners))
                }
              }}>
                Re-run results
              </TonalButton>
            </div>

          </div>

          {/* Section for open election with ongoing voting. */}
          <div className={`${voteCountingResponse != null ? "hidden" : ""} space-y-2 flex flex-col text-sm`}>
            <p>This eleciton is still open for voting. In order to begin counting the votes you must first close the election.</p>
            <TonalButton onClick={onShareVotingLink}>
              Share voting link
            </TonalButton>
            <TonalButton onClick={onCloseElection}>
              Close election
            </TonalButton>
          </div>
        </div>
      </Card>

      {(data.voteCountingResponse?.rounds ? (
        <div className="w-full max-w-[512px]">
          <h1 className="text-lg font-bold">Step-by-Step</h1>
          <Card className="">
            <VotingRoundsViewer rounds={data.voteCountingResponse.rounds} />
          </Card>
        </div>
      ) : <></>)}


      <ShareDialog textToCopy={shareableVotingUrl} ref={dialogRef} />
    </div>
  );
};

export type ShareDialogRef = {
  open: () => void;
  close: () => void;
};

type ShareDialogProps = {
  textToCopy: string,
};

const ShareDialog = forwardRef(function AppDialog(
  { textToCopy }: ShareDialogProps,
  ref: Ref<ShareDialogRef>,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [copied, setCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClick = (e: MouseEvent) => {
      // If clicked directly on the <dialog> element (the backdrop), close it
      if (e.target === dialog) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      analyticsEvents.trackShare()
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl shadow-lg p-6 mx-6 sm:mx-auto max-w-md backdrop:bg-black/50"
    >
      <h2 className="text-xl font-semibold mb-4">Copy to Clipboard</h2>
      <div className="bg-gray-100 rounded p-2 mb-4 text-sm break-all">
        {textToCopy}
      </div>
      <div className="flex justify-end space-x-2">
        <TextButton className="ring-1" onClick={() => dialogRef.current?.close()}>
          Cancel
        </TextButton>
        <TonalButton onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </TonalButton>
      </div>
    </dialog>
  );
});

const VotingRoundsViewer: React.FC<{ rounds: VoteCountingRound[] }> = ({ rounds }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const currentRound = rounds[currentRoundIndex];

  const goPrev = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    }
  };

  const goNext = () => {
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  return (
    <div className="p-3 w-full mx-auto flex flex-col items-start">
      <h2 className="text-xl font-bold">
        Round {currentRound.roundNumber}
      </h2>
      <h3 className="mb-2">
        Action: {currentRound.action}
      </h3>
      <p className="mb-2">Quota: {currentRound.quota}</p>

      <div className="mb-4">
        <h3 className="font-semibold">Winners:</h3>
        <ul className="list-disc list-inside">
          {currentRound.winners.map((winner) => (
            <li key={winner.candidate.id}>
              {winner.candidate.name} — {new Intl.NumberFormat("en-US").format(winner.votes)} votes
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Candidates:</h3>
        <ul className="list-disc list-inside">
          {currentRound.candidates.map((c) => (
            <li key={c.candidate.id}>
              {c.candidate.name} — {new Intl.NumberFormat("en-US").format(c.votes)} votes
            </li>
          ))}
        </ul>
      </div>

      <p className="mb-4">Exhausted votes: {currentRound.exhausted}</p>

      <div className="flex justify-between w-full">
        <TonalButton
          onClick={goPrev}
          disabled={currentRoundIndex === 0}
        >
          Previous
        </TonalButton>

        <TonalButton
          onClick={goNext}
          disabled={currentRoundIndex === rounds.length - 1}
        >
          Next
        </TonalButton>
      </div>
    </div>
  );
};

