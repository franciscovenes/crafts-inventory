import { createContext, useState, useEffect } from "react";
import {
  getAuthMe,
  signInWithEmail,
  signOut,
  subscribeToAuthChanges,
} from "./authService";

const AuthenticationContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await getAuthMe();
      setCurrentUser(result);
      setIsLoading(false);
    }
    getUser();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => setCurrentUser(user));

    return unsubscribe;
  }, []);

  const loginUser = async (payload) => {
    const { success, error } = await signInWithEmail(payload);
    if (success) {
      return { success: true };
    }

    return { success: false, error };
  };

  const logoutUser = async () => {
    await signOut();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <AuthenticationContext
      value={{ currentUser, loginUser, logoutUser, isLoading }}
    >
      {children}
    </AuthenticationContext>
  );
}

export { AuthenticationContext };
