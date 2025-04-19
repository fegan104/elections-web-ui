"use client"
import { TextButton, TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import { useGetElectionWinners } from "@/data/electionsClient";
import { ElectionWinnersResponse } from "@/data/model/models";
import { CircularProgress } from "@mui/material";
import { forwardRef, Ref, Suspense, useImperativeHandle, useRef, useState } from "react";

export default function ViewResults() {

  return (
    <Suspense>
      <ViewResultsScreen />
    </Suspense>
  )
}

function ViewResultsScreen() {
  const { response, closeElection, loading, error } = useGetElectionWinners()

  const handleCloseElection = async () => {
    closeElection(1)
  }

  return (
    <div>
      {loading ? <CircularProgress /> : <></>}
      {response != null ? <ElectionResults data={response} onCloseElection={handleCloseElection} /> : <></>}
      {error ? (<h3> {error} </h3>) : <></>}
    </div>
  )
}

interface ElectionResultsProps {
  data: ElectionWinnersResponse;
  onCloseElection: () => void;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({ data, onCloseElection }) => {
  const dialogRef = useRef<ShareDialogRef>(null);
  const { election, voters, winners } = data


  const onShareVotingLink = () => {
    dialogRef.current?.open()
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-fit max-w-[512px]">
        <div className="p-3 space-y-2 w-fit">
          <h2 className="text-lg font-bold">Results for {election.name}</h2>

          <div>
            <span className="text-base font-bold">Status: </span>
            <span className="text-base">{election.isOpen ? "Open" : "Closed"}</span>
          </div>

          <div>
            <h4 className="font-bold">Candidates</h4>
            <ul className="my-1">
              {election.candidates.map((candidate) => (
                <li key={candidate.id} className="text-sm">
                  -{candidate.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Voters: {voters.length} total vote(s)</h4>
            <ul className="gap-4">
              {voters.map((voter) => (
                <li key={voter.id} className="text-sm">
                  -{voter.name === "" ? `Anonymous (${voter.id})` : voter.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${winners == null ? "hidden" : ""}`}>
            <h4 className="font-bold">Winners</h4>
            <ul>
              <div className="text-sm">Ballots Exhausted {winners?.exhausted}</div>
              {winners?.winners.map((winner) => (
                <li key={winner.candidate.id} className="text-sm">
                  -{`${winner.candidate.name}  ${winner.votes} votes`}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${winners != null ? "hidden" : ""} space-y-2 flex flex-col text-sm`}>
            <p>This eleciton is still open for voting. In order to begin counting the votes you must first close the election.</p>
            <TonalButton onClick={onShareVotingLink}>
              Share voting link
            </TonalButton>
            <TonalButton onClick={onCloseElection}>
              Close election
            </TonalButton>

            <ShareDialog textToCopy={`https://elections.frankegan.com/vote?electionId=${election.id}`} ref={dialogRef} />
          </div>
        </div>
      </Card>
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl shadow-lg p-6 max-w-md w-full backdrop:bg-black/50"
    >
      <h2 className="text-xl font-semibold mb-4">Copy to Clipboard</h2>
      <div className="bg-gray-100 rounded p-2 mb-4 text-sm break-all">
        {textToCopy}
      </div>
      <div className="flex justify-end space-x-2">
        <TextButton className="ring-1" onClick={() => dialogRef.current?.close()}        >
          Close
        </TextButton>
        <TonalButton onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </TonalButton>
      </div>
    </dialog>
  );
});
