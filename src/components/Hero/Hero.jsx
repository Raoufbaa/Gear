"use client";

import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Context } from "../context";
import style from "./page.module.css";
import HeroBgdark from "@/assets/hero/HeroDark.jpg";
import HeroBglight from "@/assets/hero/HeroLight.png";
import Link from "next/link";
import Image from "next/image";
import Anim from "./anim";

export default function Hero() {
  const { isItDark } = useContext(Context);
  const [currentImage, setCurrentImage] = useState(
    isItDark ? HeroBgdark : HeroBglight
  );
  const [isImageVisible, setIsImageVisible] = useState(true);

  useEffect(() => {
    setIsImageVisible(false);
    setTimeout(() => {
      setCurrentImage(isItDark ? HeroBgdark : HeroBglight);
      setIsImageVisible(true);
    }, 150);
  }, [isItDark]);

  return (
    <div className={style.Hero}>
      <div className={style.cover}>
        <motion.div
          className={style.IHero}
          initial={{ opacity: 0 }}
          animate={{ opacity: isImageVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            className={style.herlo}
            width={1360}
            height={530}
            src={currentImage}
            alt=""
          />
        </motion.div>
        <div className={style.container}>
          <Anim />

          <Link className={style.btn} href={"/Shop"}>
            BUY NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
