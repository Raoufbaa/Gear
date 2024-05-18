"use client";
import Image from "next/image";
import style from "./page.module.css";
import image from "@/assets/about/Living-room-wallpaper-1200x800.jpg";
import { useForm, ValidationError } from "@formspree/react";
function ContactForm() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const [state, handleSubmit] = useForm(formId);
  if (state.succeeded) {
    return <p className={style.empty}>Thank you for reaching out to us!</p>;
  }
  return (
    <div className={style.contactContainer}>
      <Image src={image} width={560} alt="" className={style.colorBlock} />
      <form className={style.contactForm} onSubmit={handleSubmit}>
        <input
          className={style.contactInput}
          id="name"
          type="text"
          name="name"
          placeholder="Your Name"
        />

        <input
          className={style.contactInput}
          id="email"
          type="email"
          name="email"
          placeholder="Your Email"
        />

        <input
          className={style.contactInput}
          id="phone"
          type="tel"
          name="phone"
          placeholder="Phone"
        />

        <textarea
          className={style.contactInput}
          id="message"
          name="message"
          placeholder="Your Message Here"
        />
        <button className={style.contactSubmit} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
function App() {
  return <ContactForm />;
}
export default App;
