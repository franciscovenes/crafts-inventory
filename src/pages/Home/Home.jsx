import styles from "./Home.module.css";
import { NavLink } from "react-router-dom";
// import logo from "/img/logo.png";
import RegisterUser from "../../components/RegisterUser";
import Fade from "../../components/Fade";
import { useState, useContext } from "react";
import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useCurrentUser } from "../../features/auth/useCurrentUser";

export default function Home() {
  // const { currentUser } = useContext(AuthenticationContext);
  const currentUser = useCurrentUser();

  // State to mount/unmount signup component
  const [register, setRegister] = useState(false);

  return <div className={styles.container}>Home</div>;
}
