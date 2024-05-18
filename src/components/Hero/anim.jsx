"use client";
import style from "./page.module.css";
import { TypeAnimation } from "react-type-animation";

export default function H5anim() {
  return (
    <div className={style.animation}>
      <TypeAnimation
        className={style.toptitle}
        sequence={["New Arrival", 1000]}
        wrapper="h5"
        speed={35}
        repeat={Infinity}
      />
      <TypeAnimation
        className={style.title}
        sequence={["Discover Our New Collection", 1000]}
        wrapper="h5"
        speed={60}
        repeat={Infinity}
      />
      <TypeAnimation
        className={style.info}
        sequence={[
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed ratione beatae rerum adipisci",
          1000,
        ]}
        wrapper="p"
        speed={90}
        repeat={Infinity}
      />
    </div>
  );
}
