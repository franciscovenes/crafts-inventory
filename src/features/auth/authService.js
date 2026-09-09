import { supabase } from "../../lib/supabase";

export async function getAuthMe() {
  // check if an authenticated user exists
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (sessionData.session) {
    const { id } = sessionData.session.user;
    console.log("UserId: ", id);
    const { data: profileData, profileError } = await supabase
      .from("profiles")
      .select(
        `
        display_name,
        role,
        active
        `,
      )
      .eq("id", id);

    if (profileError) {
      throw profileError;
    }
    return profileData;
  }

  return null;
}

export async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "francisco.venes@gmail.com",
    password: "l4jHlSX4tmgH7v8Js2TR",
  });

  if (error) {
    throw error;
  }

  return data;
}

export function logout() {}
