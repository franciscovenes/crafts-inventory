import { supabase } from "../../lib/supabase";

export async function getAuthMe() {
  // check if an authenticated user session exists
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (sessionData.session) {
    const { id, email } = sessionData.session.user;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        display_name,
        role,
        active
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (profileData) {
      const { role, active, display_name } = profileData;
      return {
        id,
        email,
        role,
        active,
        displayName: display_name,
      };
    }
  }

  return null;
}

export async function signInWithEmail(payload) {
  const { error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    if (error.code === "invalid_credentials") {
      return {
        success: false,
        error: error.code,
      };
    }

    throw error;
  }

  const currentUser = await getAuthMe();

  if (!currentUser)
    return {
      success: false,
      error: "invalid_account",
    };

  if (!currentUser.active)
    return {
      success: false,
      error: "inactive_account",
    };

  return {
    success: true,
    ...currentUser,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    throw error;
  }

  return { success: true };
}

export function subscribeToAuthChanges(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, _session) => {
    setTimeout(async () => {
      const result = await getAuthMe();
      console.log(result);
      callback(result);
    }, 0);
  });

  return () => data.subscription.unsubscribe;
}
