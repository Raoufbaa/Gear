import Image from "next/image";
import style from "./page.module.css";
import a from "@/assets/recent/Collection.png";

export default function Rcents() {
  return (
    <div className={style.container}>
      <div>
        <h5 className={style.subtitle}>Share your setup with</h5>
        <h2 className={style.title}>
          #{process.env.NEXT_PUBLIC_NAME}Furniture
        </h2>
      </div>
      <div>
        <Image src={a} width={950} height={350} alt="" />
      </div>
    </div>
  );
}
