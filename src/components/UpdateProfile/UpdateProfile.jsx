"use client";
import style from "./page.module.css";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UpdateProfile() {
  const { data: session } = useSession();
  // console.log("sesssion", session);
  const [formData, setFormData] = useState({
    first_name: session?.name || "",
    last_name: session?.Last_name || "",
    password: "",
    phone: "",
    email: session?.email || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (session) {
        const jwtToken = session.accessToken;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/customers/me`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          console.log("Profile updated successfully");
        } else {
          console.error("Profile update failed");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    if (session) {
      setFormData({
        first_name: session.name || "",
        last_name: session.Last_name || "",
        email: session.email || "",
        password: "",
        phone: session.phone || "",
      });
    }
  }, [session]);
  return (
    <div>
      <h2 className={style.title}>UPdate Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={style.input}
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder={session ? formData.name : "First Name"}
        />
        <input
          className={style.input}
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder={session ? formData.last_name : "Last Name"}
        />
        <input
          className={style.input}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          className={style.input}
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={session ? formData.phone : "Phone"}
        />
        <input
          className={style.input}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={session ? formData.email : "Email"}
        />
        <button className={style.btn} type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
}
