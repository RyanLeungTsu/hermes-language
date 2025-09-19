// Sign-In Functionality
import { supabase } from "@/lib/supabaseClient";

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    // This is the redirecting to user dashboard
    options: {
      redirectTo: `${window.location.origin}/dashboard`, 
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
  } else {
    console.log("Redirecting to Google login...");
  }
}

// Sign-Out Functionality
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error.message);
    throw error;
  }
}