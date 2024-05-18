import Image from "next/image";
import style from "./page.module.css";
import trophy from "@/assets/header/Group.png";
import customer from "@/assets/header/customer-support.png";
import guarante from "@/assets/header/guarantee.png";
import shipping from "@/assets/header/shipping.png";
export default function ButtomHeader() {
  return (
    <div className={style.container}>
      <div className={style.topcontainer}>
        <Image
          className={style.text}
          src={trophy}
          width={40}
          height={40}
          alt=""
        />
        <div className={style.text}>
          <h1 className={style.title}>High Quality</h1>
          <p className={style.secondetitle}>crafted from top material</p>
        </div>
        <Image
          className={style.text}
          src={guarante}
          width={40}
          height={40}
          alt=""
        />
        <div className={style.text}>
          <h1 className={style.title}>Warranty Protection</h1>
          <p className={style.secondetitle}>Over 2 year</p>
        </div>
        <Image
          className={style.text}
          src={shipping}
          width={40}
          height={40}
          alt=""
        />
        <div className={style.text}>
          <h1 className={style.title}>Free Shipping </h1>
          <p className={style.secondetitle}>Order Over 150$</p>
        </div>
        <Image
          className={style.text}
          src={customer}
          width={40}
          height={40}
          alt=""
        />
        <div className={style.text}>
          <h1 className={style.title}>24/7 Support</h1>
          <p className={style.secondetitle}>Dedicated Support</p>
        </div>
      </div>
    </div>
  );
}
