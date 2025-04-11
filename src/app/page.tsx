export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <a href="/create-election">Administer an Election</a>
        <a href="/vote?electionId=94ee638d-1ece-4071-ad3c-710ac8641042">Vote in an Election</a>
        <a href="/sign-up">Sign Up</a>
        <a href="/sign-in">Sign In</a>
        <a href="/view-elections">View My Elections</a>
        <a href="/view-results?electionId=94ee638d-1ece-4071-ad3c-710ac8641042">View My Results</a>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}