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
    /* async function signIn() {
      const result = await loginUser({
        email: "francisco.venes@gmail.com",
        password: "l4jHlSX4tmgH7v8Js2TR",
      });
    }
    signIn(); */

    async function getUser() {
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
      return undefined;
    }

    return error;
  };

  const logoutUser = async () => {
    await signOut();
  };

  // console.log("Current User: ", currentUser);
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
