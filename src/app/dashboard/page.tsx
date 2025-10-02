"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { User } from "@supabase/supabase-js";
// Components
import ProfileAvatar from "@components/ProfileAvatar";
import Flashcards from "@components/Flashcards";

type Tab = "home" | "chat" | "flashcards" | "account";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const router = useRouter();
    
  useEffect(() => {
    async function getSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error);
      if (session) setUser(session.user);
      setLoading(false);
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
  if (!loading && !user) {
    router.push("/");
  }
}, [loading, user, router]);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="flex gap-6 px-6 py-4 bg-black shadow">
        {/* Home tab */}
        <button
          onClick={() => setActiveTab("home")}
          className={activeTab === "home" ? "font-bold text-purple-700" : "text-white-600"}
        >
          🏠 Home
        </button>
        {/* Chat Tab */}
        <button
          onClick={() => setActiveTab("chat")}
          className={activeTab === "chat" ? "font-bold text-purple-700" : "text-white-600"}
        >
          💬 Chat
        </button>
        {/* Flashcards Tab */}
        <button
          onClick={() => setActiveTab("flashcards")}
          className={activeTab === "flashcards" ? "font-bold text-purple-700" : "text-white-600"}
        >
          🃏 Flashcards
        </button>
        {/* Account Tab */}
        <button
          onClick={() => setActiveTab("account")}
          className={activeTab === "account" ? "font-bold text-purple-700" : "text-white-600"}
        >
          👤 Account
        </button>
      </nav>

      {/* Content for different tabs */}
      {/* Home Content */}
      <div className="p-6">
        {activeTab === "home" && (
          <div>
            {user && <ProfileAvatar user={user} />}
            <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
            <p className="mt-2">You are now signed in!</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
        {/* Chat Content */}
        {activeTab === "chat" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Chatbot</h2>
            <p>Chatbot</p>
          </div>
        )}
        {/* Flashcards content */}
        {activeTab === "flashcards" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Flashcards</h2>
            <Flashcards />
            <p>Flashcards.</p>
          </div>
        )}
        {/* Account content */}
        {activeTab === "account" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Account Info</h2>
            <p>Email: {user?.email}</p>
            {user && <ProfileAvatar user={user} />}
          </div>
        )}
      </div>
    </main>
  );
  }