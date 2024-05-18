"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import style from "./page.module.css";

function RequestPassword() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(""); // Clear error message when email changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if email exists
      const checkResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/store/auth/${email}`
      );

      if (!checkResponse.data.exists) {
        throw new Error("This email does not exist.");
      }

      // If email exists, proceed with password reset request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/store/customers/password-token`,
        { email }
      );
      console.log("Password reset request successful:", response.data);
      setSuccessMessage("Password reset email sent successfully!");
      // Clear the email field after success
      setEmail("");
    } catch (error) {
      console.error("Error resetting password:", error);
      // Handle error, such as showing an error message to the user
      setErrorMessage(error.message); // Set error message state
    }
  };

  return (
    <div className={style.Container}>
      <h2 className={style.Header}>Reset Password</h2>
      {errorMessage && <h3 className={style.ErrorsMessage}>{errorMessage}</h3>}
      {successMessage && (
        <div className={style.successMessage}>{successMessage}</div>
      )}
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.formGroup}>
          <label className={style.lable}>Enter Your Email Adress</label>
          <input
            type="email"
            value={email}
            onChange={handleChange}
            required
            className={style.formInput}
            placeholder="Enter Your Email Address"
          />
        </div>
        <button className={style.submitButton} type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default RequestPassword;
