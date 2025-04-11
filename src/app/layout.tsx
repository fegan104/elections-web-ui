'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import useFirebaseUser from "@/data/useFirebaseUser";
import { Avatar, Button } from "@mui/material";
import { auth, signOut } from "@/data/firebaseClient"
import { TonalButton } from "@/components/Buttons";

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background font-mono h-screen flex flex-col`}>
        <TopAppBar />

        <div className="ring-foreground ring-1 rounded-2xl m-4 flex-grow p-2 bg-neutral-100 overflow-scroll">
          {children}
        </div>
      </body>
    </html>
  );
}

const TopAppBar = () => {
  const user = useFirebaseUser();

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <div className="sticky w-full flex flex-row flex-shrink-0 align-middle justify-end px-4 py-2 items-center space-x-2">
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
              <Button color="inherit">Sign In</Button>
            </a>
            <a href="/sign-up">
              <Button color="inherit">Sign Up</Button>
            </a>
          </>
        )}
      </div>
  );
};
