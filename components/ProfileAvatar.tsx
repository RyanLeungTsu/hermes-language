"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface ProfileAvatarProps {
  user: User | null;
}

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load avatar from DB when user changes
  useEffect(() => {
    if (!user) return;

    const fetchAvatar = async () => {
        if (!user?.id) return; // stop if user is null

        const { data, error } = await supabase
            .from("Profiles")
            .select("avatar_url")
            .eq("id", user.id)
            .maybeSingle();

        if (error) console.error(error);
        else setAvatarUrl(data?.avatar_url ?? null);
    };

    fetchAvatar();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file)); 
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      setAvatarUrl(result.publicUrl);

      // Save public URL to Profiles table 
      const { error: dbError } = await supabase
        .from("Profiles")
        .update({ avatar_url: result.publicUrl })
        .eq("id", user.id);

      if (dbError) console.error("DB error:", dbError);
      else console.log("Avatar updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="profile-avatar" className="cursor-pointer">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile Picture"
            className="object-cover w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            +
          </div>
        )}
      </label>
      <input
        id="profile-avatar"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}