import { createContext, useState, useEffect } from "react";
import { getAuthMe, signInWithEmail } from "./authService";

const AuthenticationContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    async function signInUser() {
      await signInWithEmail();
    }
    signInUser();

    async function getUser() {
      const result = await getAuthMe();
      setCurrentUser(result);
    }
    getUser();
  }, []);

  console.log("Current User: ", currentUser);

  return (
    <AuthenticationContext value={currentUser}>
      {children}
    </AuthenticationContext>
  );
}
