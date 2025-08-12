// src/components/auth/SlidingAuth/SlidingAuth.tsx
import type { FC } from "react";
import { useEffect, useState } from "react";
import styles from "./SlidingAuth.module.css";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";

type Props = {
  initialMode?: "signin" | "signup";
};

const SlidingAuth: FC<Props> = ({ initialMode = "signin" }) => {
  const [rightActive, setRightActive] = useState(initialMode === "signup");
  const navigate = useNavigate();

  useEffect(() => {
    setRightActive(initialMode === "signup");
  }, [initialMode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setRightActive(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showSignup = () => {
    setRightActive(true);
    navigate("/signup");
  };
  const showSignin = () => {
    setRightActive(false);
    navigate("/login");
  };

  // build container class with possible right-panel active
  const containerClass = `${styles["sa-container"]} ${rightActive ? styles["sa-rightPanelActive"] : ""}`;

  return (
    <div className={styles["sa-wrapper"]}>
      <div className={styles["sa-mobileToggle"]}>
        <button
          className={`${styles["sa-mobileBtn"]} ${!rightActive ? styles["sa-activeMobileBtn"] : ""}`}
          onClick={showSignin}
          type="button"
        >
          Sign In
        </button>
        <button
          className={`${styles["sa-mobileBtn"]} ${rightActive ? styles["sa-activeMobileBtn"] : ""}`}
          onClick={showSignup}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <div id="container" className={containerClass}>
        <div className={`${styles["sa-formContainer"]} ${styles["sa-signUpContainer"]}`}>
          <div className={styles["sa-inner"]}>
            <h1>Create Account</h1>
            <div className={styles["sa-social"]}>
              <a href="#" aria-label="Sign up with Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Sign up with Google"><FaGooglePlusG /></a>
              <a href="#" aria-label="Sign up with LinkedIn"><FaLinkedinIn /></a>
            </div>
            <span>or use your email for registration</span>
            <SignupForm />
          </div>
        </div>

        <div className={`${styles["sa-formContainer"]} ${styles["sa-signInContainer"]}`}>
          <div className={styles["sa-inner"]}>
            <h1>Sign in</h1>
            <div className={styles["sa-social"]}>
              <a href="#" aria-label="Sign in with Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Sign in with Google"><FaGooglePlusG /></a>
              <a href="#" aria-label="Sign in with LinkedIn"><FaLinkedinIn /></a>
            </div>
            <span>or use your account</span>
            <LoginForm />
          </div>
        </div>

        <div className={styles["sa-overlayContainer"]}>
          <div className={styles["sa-overlay"]}>
            <div className={`${styles["sa-overlayPanel"]} ${styles["sa-overlayLeft"]}`}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className={styles["sa-overlayBtn"]} onClick={showSignin} type="button">
                Sign In
              </button>
            </div>

            <div className={`${styles["sa-overlayPanel"]} ${styles["sa-overlayRight"]}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className={styles["sa-overlayBtn"]} onClick={showSignup} type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SlidingAuth;
