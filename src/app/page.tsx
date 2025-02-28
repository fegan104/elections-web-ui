import Link from "next/link"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <Link href="/create-election">Administer an Election</Link>
       <Link href="/vote#/1840-89ef02-83aff">Vote in an Election</Link>
       <Link href="/sign-up">Sign Up</Link>
       <Link href="/sign-in">Sign In</Link>
       <Link href="/view-elections">View My Elections</Link>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
       
      </footer>
    </div>
  );
}
