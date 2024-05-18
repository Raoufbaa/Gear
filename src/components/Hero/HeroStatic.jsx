import style from "./page.module.css";
import HeroBgdark from "@/assets/header/Rectangle 1.png";
import itsDarkIcon from "@/assets/nav/loading.svg";
import Link from "next/link";
import Image from "next/image";
import Anim from "./anim";
export default function Hero() {
  return (
    <div className={style.Hero}>
      <div className={style.cover}>
        <Image
          className={style.herlo}
          width={1360}
          height={530}
          src={HeroBgdark}
          style={{ filter: "blur(40px)" }}
          alt=""
        />
        <Image
          className={style.loading}
          width={400}
          height={400}
          src={itsDarkIcon}
          alt=""
        />
        <div className={style.StaticContainer} style={{ filter: "blur(30px)" }}>
          <Anim />
          <Link className={style.btn} href={"/Shop"}>
            BUY NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
