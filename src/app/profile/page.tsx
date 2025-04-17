"use client";
import React, { useState, useEffect } from "react";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import useFirebaseUser from "@/data/useFirebaseUser";
import { CircularProgress } from "@mui/material";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { TonalButton } from "@/components/Buttons";

const EditProfilePage = () => {
  const { status, user } = useFirebaseUser();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    setMessage(null);
    try {
      const profileUpdates: { displayName?: string; photoURL?: string } = {};
      if (displayName !== user.displayName) {
        profileUpdates.displayName = displayName;
      }
      if (photoURL !== user.photoURL) {
        profileUpdates.photoURL = photoURL;
      }

      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(user, profileUpdates);
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      if (password) {
        await updatePassword(user, password);
      }
      setMessage("Profile updated successfully.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  if (status == 'loading') {
    return <CircularProgress />
  }

  if (status == 'unauthenticated') {
    return (
      <main className="max-w-xl mx-auto px-4 py-12 text-center text-gray-600">
        You must be logged in to edit your profile.
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12 space-y-6 text-gray-800">
      <Card className="space-y-6">

        <h1 className="text-2xl font-bold text-center">Edit Profile</h1>

        {message && (
          <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded">
            {message}
          </div>
        )}

        <TextInput
          value={displayName}
          onChange={setDisplayName}
          label="Display Name"
        />

        <TextInput
          type="email"
          value={email}
          onChange={setEmail}
          label="Email"
        />

        <TextInput
          type="url"
          value={photoURL}
          onChange={setPhotoURL}
          label="Photo URL"
        />

        <TextInput
          type="password"
          value={password}
          placeholder="Leave blank to keep current password"
          onChange={(e) => setPassword(e)}
          label="New Password"
        />

        <TonalButton onClick={handleUpdate}>
          Save Changes
        </TonalButton>
      </Card>
    </main>
  );
};

export default EditProfilePage;
