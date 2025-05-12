'use client'
import { useGetCurrentUsersElections } from "@/data/electionsClient"
import CircularProgress from "@/components/CircularProgress";
import { Election } from "@/data/model/models"
import FloatingActionButton, { TextButton, TonalButton } from "@/components/Buttons";
import { ErrorMessage } from "@/components/ErrorMessage";
import useFirebaseUser from "@/data/useFirebaseUser";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { status } = useFirebaseUser()

  if (status == 'loading') {
    return <CircularProgress />
  }

  if (status == "unauthenticated") {
    return <LandingPage />
  }

  return <ViewElections />;
}

const LandingPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-800">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Run Fair Elections with STV</h1>
        <p>
          This tool helps you run elections using{" "}
          <span className="font-semibold">Single Transferable Vote (STV)</span> — a voting method that gives everyone a fair say and leads to more balanced results.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What is STV?</h2>
        <p>
          With STV, voters <strong>rank candidates</strong> in order of preference.
        </p>
        <blockquote className="bg-gray-50 border-l-4 border-gray-300 p-3 italic">
          1. Jamie<br />
          2. Alex<br />
          3. Taylor
        </blockquote>
        <p>
          This helps make sure your vote still counts, even if your top choice doesn’t win.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Voters rank the candidates</li>
          <li>A quota is calculated</li>
          <li>Candidates who reach the quota are elected</li>
          <li>Extra and eliminated votes are transferred</li>
          <li>This repeats until all seats are filled</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Why use it?</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>More fair and representative</li>
          <li>Less wasted votes</li>
          <li>Encourages honest rankings</li>
          <li>Great for groups, teams, and councils</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How to get started</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Create your election</li>
          <li>Add candidates</li>
          <li>Share the voting link</li>
          <li>See the results when voting ends</li>
        </ol>
      </section>

      <div className="text-center pt-4 space-y-2">
        <Link href="/sign-up">
          <TonalButton className="w-full">Create an Account</TonalButton>
        </Link>
        <p>or</p>
        <Link href="/about">
          <TextButton className="w-full">Learn how STV works in detail</TextButton>
        </Link>
      </div>
    </main>
  );
};

const ViewElections = () => {
  const { data, loading, error } = useGetCurrentUsersElections()

  if (loading) {
    return (<CircularProgress />)
  } else if (error) {
    return (
      <ErrorMessage>
        {error}
      </ErrorMessage>
    )
  } else if (data) {
    return (
      <main className="pb-12">
        <h1 className="text-lg px-4">Elections</h1>

        <ElectionList elections={data} />

        <div className="md:hidden">
          <Link href="/create-election">
            <FloatingActionButton label={"Create"} icon={<CirclePlus className="size-6" />} />
          </Link>
        </div>
      </main>
    )
  }
}

const ElectionList: React.FC<{ elections: Election[] }> = ({ elections }) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">
      {elections.map((election) => <div key={election.id} className="bg-primary-container rounded-lg p-4">
        <div className="space-y-3 flex flex-col h-full">

          <ElectionStatus election={election} />

          <div className="flex flex-1 flex-col place-content-end">

            <div className="flex flex-wrap justify-end items-center gap-2">

              <Link href={`/vote?electionId=${election.id}`} className={`${!election.isOpen ? "hidden" : ""}`}>
                <TextButton className="ring-primary ring-1"> {"Vote"} </TextButton>
              </Link>

              <Link href={`/view-results?electionId=${election.id}`}>
                <TextButton className="ring-primary ring-1"> {"View Results"} </TextButton>
              </Link>
            </div>

          </div>
        </div>
      </div>)}
    </div>
  )
};

const ElectionStatus: React.FC<{ election: Election }> = ({ election }) => {
  return (
    <div>
      <h2 className="text-lg font-bold underline">{election.name}</h2>
      <div>
        <span className="text-base font-bold">Status: </span>
        <span className="text-base">{election.isOpen ? "Open" : "Closed"}</span>
      </div>

      <div>
        <h4 className="font-bold">Candidates:</h4>
        <ul className="my-1">
          {election.candidates.map((candidate) => (
            <li key={candidate.id} className="text-sm">
              -{candidate.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold">Voters: {election.voters.length} total votes</h4>
      </div>
    </div>
  )
}