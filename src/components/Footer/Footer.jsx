import style from "./page.module.css";
import Link from "next/link";
import { links } from "@/components/NavBar/data";
import { socials } from "./data";

export default function Footer() {
  return (
    <>
      <div className={style.Maincontianer}>
        <div className={style.info}>
          <h1 className={style.title}>{process.env.NEXT_PUBLIC_NAME}</h1>
          <p className={style.desc}>
            400 University Drive Suite 200 Coral Gables, FL 33134 USA
          </p>
        </div>
        <div className={style.flex}>
          <div className={style.links}>
            <h3 className={style.Linkt}>Quick Links</h3>
            {links.map((links) => (
              <Link className={style.link} key={links.id} href={links.url}>
                {links.title}
              </Link>
            ))}
          </div>
          <div className={style.Mainsocials}>
            <h3 className={style.Social}>Follow Us</h3>
            {socials.map((socials) => (
              <Link className={style.link} key={socials.id} href={socials.url}>
                {socials.title}{" "}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={style.fcontainer}>
        <hr className={style.hr} />
        <h4 className={style.copyright}>
          © Copyright 2024 by Raouf, All rights reserved.
        </h4>
      </div>
    </>
  );
}
