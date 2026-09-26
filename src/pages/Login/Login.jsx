import { Eye, EyeOff } from "lucide-react";
import styles from "./Login.module.css";
import { useState } from "react";
import "@fontsource/jetbrains-mono";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  const handlePasswordVisibility = (event) => {
    setIsVisible((prevState) => !prevState);
  };
  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="/logo/logo-light.svg"
        alt="The official logo for crafts-inventory"
      />
      <h1 className={styles.title}>crafts_inventory</h1>
      <form className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
          {/* ZodError component for email will go in here */}
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordBox}>
            <input type={isVisible ? "text" : "password"} id="password" />
            <button type="button" onClick={handlePasswordVisibility}>
              {isVisible ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {/* ZodError component for password will go in here */}
        </div>
        {/* <p>Login error messages will go in here</p> */}
      </form>
    </div>
  );
}
