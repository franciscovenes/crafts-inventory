import { Eye, EyeOff } from "lucide-react";
import styles from "./Login.module.css";
import { useState, useContext } from "react";
import "@fontsource/jetbrains-mono";
import { ArrowRight } from "lucide-react";
import { AuthenticationContext } from "../../features/auth/AuthenticationContext";
import * as z from "zod";
import FieldError from "../../components/FieldError/FieldError";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .pipe(z.email({ error: "Must be a valid email" })),
  password: z
    .string({ error: "Password must be a string" })
    .min(1, { error: "Password is required" }),
});

export default function Login() {
  const navigate = useNavigate();

  const { loginUser } = useContext(AuthenticationContext);

  const [isVisible, setIsVisible] = useState(false);

  const [zodErrors, setZodErrors] = useState(null);

  const [loginError, setLoginError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(null);
    const formData = new FormData(event.target);

    const { success, data, error } = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!success) {
      setZodErrors(z.treeifyError(error));
      return;
    }

    setZodErrors(null);
    setIsSubmitting(true);

    try {
      const loginResult = await loginUser(data);

      if (loginResult.success) {
        navigate("/");
        return;
      }

      switch (loginResult.error) {
        case "invalid_credentials":
          setLoginError("Invalid credentials, please try again.");
          break;
        case "invalid_account":
          setLoginError("This account isn't valid.");
          break;
        case "inactive_account":
          setLoginError("This account is no longer active.");
          break;
        default:
          setLoginError("Login failed.");
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="/logo/logo-light.svg"
        alt="The official logo for crafts-inventory"
      />
      <h1 className={styles.title}>crafts_inventory</h1>
      <div>
        <form noValidate className={styles.form} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
            <FieldError errors={zodErrors?.properties?.email?.errors} />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordBox}>
              <input
                type={isVisible ? "text" : "password"}
                id="password"
                name="password"
              />
              <button type="button" onClick={handlePasswordVisibility}>
                {isVisible ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <FieldError errors={zodErrors?.properties?.password?.errors} />
          </div>
          {/* <p>Login error messages will go in here</p> */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Logging in..."
            ) : (
              <>
                Login <ArrowRight />
              </>
            )}
          </button>
        </form>
        <p className={styles.loginError}>{loginError}</p>
      </div>
    </div>
  );
}
