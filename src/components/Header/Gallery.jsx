import React from "react"; // Import React
import style from "./page.module.css"; // Import your CSS module
import Pimg from "@/assets/header/Image.png"; // Import the images with correct paths
import Rectangle25 from "@/assets/header/Rectangle 25.png";
import Rectangle26 from "@/assets/header/Rectangle 26.png";
import Image from "next/image";

export default function Gallery() {
  return (
    <div className={style.MainContainer}>
      <Image
        className={style.Pimg}
        src={Pimg}
        width={250}
        height={310}
        alt=""
      />
      <Image
        className={style.Pimg}
        src={Rectangle25}
        width={250}
        height={310}
        alt=""
      />
      <Image
        className={style.Pimg}
        src={Rectangle26}
        width={250}
        height={310}
        alt=""
      />
    </div>
  );
}
