"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";


export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) setUser(data.session.user);
      setLoading(false);
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <main className="p-8 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <p>You are now signed in!</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}