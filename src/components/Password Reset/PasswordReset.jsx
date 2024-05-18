"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !token) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/store/customers/password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, token }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Password Changed Successfully");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className={styles.Container}>
      <h1 className={styles.Header}>Password Reset</h1>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.lable}>Email</label>
          <input
            type="email"
            value={email}
            className={styles.formInput}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.lable}>Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            className={styles.formInput}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.lable}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            className={styles.formInput}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className={styles.submitButton} type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordResetPage;
