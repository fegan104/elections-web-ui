'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import useFirebaseUser from "@/data/useFirebaseUser";
import { AppBar, Avatar, Button, IconButton, Toolbar } from "@mui/material";
import { auth, signOut } from "@/data/firebaseClient"
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TopAppBar />

        {children}
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
    <AppBar position="sticky">
      <Toolbar>
        {user ? (
          <>
            <IconButton color="inherit" onClick={handleSignOut}>
              Sign Out
            </IconButton>
            <Avatar alt={user.displayName ?? undefined} src={user.photoURL ?? undefined} />
          </>
        ) : (
          <>
            <Link href="/sign-in" passHref>
              <Button color="inherit">Sign In</Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button color="inherit">Sign Up</Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
