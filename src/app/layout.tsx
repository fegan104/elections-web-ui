'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import useFirebaseUser from "@/data/useFirebaseUser";
import { Avatar } from "@mui/material";
import { auth, signOut } from "@/data/firebaseClient"
import { TextButton, TonalButton } from "@/components/Buttons";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>cascade-elections</title>
        <meta name="description" content="A single tranferable vote elections web app." />
        <meta name="author" content="Frank Egan" />
        <meta name="theme-color" content="#3b82f6" />

      </head>
      <body className={`
          ${geistSans.variable} ${geistMono.variable} 
          antialiased bg-background font-mono 
          h-full overflow-hidden flex flex-col`}>

        <Scaffold>
          {children}
        </Scaffold>

      </body>
    </html>
  );
}

function Scaffold({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-hidden flex flex-col h-full">
      <TopAppBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex flex-col sm:hidden">
          <SideBar />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4 ring-foreground ring-1 rounded-2xl m-4">
            {children}
          </div>

          {/* <div className="md:hidden">
            <a href="/create-election">
              <FloatingActionButton label={"Create"} icon={<Plus className="size-6" />}/>
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

const TopAppBar = () => {
  const { user } = useFirebaseUser();

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <div className="sticky w-full flex flex-row flex-shrink-0 align-middle justify-end px-4 py-2 mt-2 items-center space-x-2">
      <h4 className="flex-1 justify-start">cascade-elections</h4>
      {user ? (
        <>
          <TonalButton onClick={handleSignOut}>
            Sign Out
          </TonalButton>
          <Avatar alt={user.displayName ?? undefined} src={user.photoURL ?? undefined} />
        </>
      ) : (
        <>
          <a href="/sign-in">
            <TextButton>Sign In</TextButton>
          </a>
          <a href="/sign-up">
            <TextButton>Sign Up</TextButton>
          </a>
        </>
      )}
    </div>
  );
};

const SideBar = () => {

  return (
    <div className="p-4 justify-items-center">
      <a href="/create-election">
        <TonalButton><PlusCircle size={24} className="pe-1" /> Create an Election</TonalButton>
      </a>

      <div className="pt-4 justify-center">
        <Link href="/">
          <TextButton className="text-on-surface">View My Elections</TextButton>
        </Link>
      </div>
    </div>
  )
};

// function BottomAppBar() {
//   return (
//     <div className="bg-secondary-container rounded-t-md flex justify-around items-center w-full h-[80px] align-middle">
//       <NavItem
//         href="/"
//         icon={<Vote size={24} />}
//         label="My Elections"
//         active={false}
//         onClick={() => { }}
//       />
//       <NavItem
//         href="/create-election"
//         icon={<PlusCircle size={24} />}
//         label="Create"
//         active={true}
//         onClick={() => { }}
//       />
//     </div>
//   );
// }

// function NavItem({
//   href,
//   icon,
//   label,
//   active,
//   onClick,
// }: {
//   href: string,
//   icon: React.ReactNode;
//   label: string;
//   active: boolean;
//   onClick: (link: string) => void;
// }) {
//   return (
//     <a href={href}>
//       <button
//         onClick={() => onClick(href)}
//         className={`flex flex-col items-center justify-center pt-1`}
//       >
//         <span className={`w-16 flex items-center justify-center px-4 h-8 rounded-full transition-colors 
//         ${active ? 'bg-blue-200 text-blue-500 font-semibold' : 'text-gray-500'}`}>
//           {icon}
//         </span>
//         <span className="text-xs mb-4">{label}</span>
//       </button>
//     </a>
//   );
// }