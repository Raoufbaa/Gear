"use client";
import style from "./page.module.css";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import Link from "next/link";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [captcha, setCaptcha] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaptcha("");

    if (!executeRecaptcha) {
      console.log("ReCaptcha execution not available.");
      return;
    }

    try {
      const gRecaptchaToken = await executeRecaptcha("inquirySubmit");
      const recaptchaResponse = await axios({
        method: "post",
        url: "/api/recaptchaSubmit",
        data: {
          gRecaptchaToken, // Fix variable name to match backend
        },
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });

      if (recaptchaResponse.data.success) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/customers`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setSuccessMessage("User Created Successfully");
          setErrorMessage("");
        } else {
          setErrorMessage("Registration failed");
          setSuccessMessage("");
        }
      } else {
        console.log("reCAPTCHA verification failed");
        setCaptcha("Failed to verify reCAPTCHA!");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response && error.response.status === 422) {
        setErrorMessage("User Already Exists");
        setSuccessMessage("");
      } else {
        setErrorMessage("Registration failed");
        setSuccessMessage("");
      }
    }
  };

  return (
    <div>
      <div className={style.register}>
        <h1 className={style.title}>REGISTER NOW</h1>
        {successMessage && <p className={style.empty}>{successMessage}</p>}
        {errorMessage && <p className={style.Eempty}>{errorMessage}</p>}
        <form className={style.form} onSubmit={handleSubmit}>
          <input
            className={style.input}
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
          />
          <input
            className={style.input}
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
          />
          <input
            className={style.input}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            className={style.input}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            className={style.input}
            type="text"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <button className={style.btn} type="submit">
            Register
          </button>
        </form>
        <hr style={{ margin: "10px " }} />
        <span>
          Do You have an account?{" "}
          <Link className={style.link1} href="/api/auth/signin">
            SignIn
          </Link>
        </span>
        <br />
        <Link className={style.Link} href="../../RequestPasswordReset">
          Forgot Your Password?
        </Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
