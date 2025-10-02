"use client";

import { signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="bg-foreground/5 p-10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-text">Welcome!</h1>
        <p className="text-sm text-foreground/70 text-center">
          Sign in to continue to Hermes Language
        </p>
          <button
              onClick={signInWithGoogle}
              className="px-6 py-4 text-text rounded-xl font-semibold bg-primary hover:bg-red-600 transition-all duration-300 shadow-md"
            >
              Sign in with Google
          </button>
      </div>
    </main>
  );
}