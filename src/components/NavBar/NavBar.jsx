import Link from "next/link";
import style from "./page.module.css";
import Image from "next/image";
import navlogo from "@/assets/nav/marechal.svg";
import { links } from "@/components/NavBar/data";
import NavIcon from "./NavIcon";

export default function NavBar() {
  const account = () => {};
  return (
    <>
      <nav className={style.Navbar}>
        <Link className={style.navlogo} href={"/"}>
          <Image
            className={style.img}
            src={navlogo}
            width={40}
            height={50}
            alt=""
          />
          <span className={style.spanlogo}>{process.env.NEXT_PUBLIC_NAME}</span>
        </Link>
        <div className={style.linkscontainer}>
          {links.map((links) => (
            <Link className={style.links} key={links.id} href={links.url}>
              {links.title}
            </Link>
          ))}
        </div>
        <NavIcon />
      </nav>
      <section className={style.mobileheader}>
        <div className={style.mobilelinkcontainer}>
          {links.map((link) => (
            <Link className={style.Mlinks} key={link.id} href={link.url}>
              <div className={style.Micon}>{link.img}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
