import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";

import Rog from "@/assets/category/Bcategory/rog.png";
import Logitech from "@/assets/category/Bcategory/logitech.png";
import Havit from "@/assets/category/Bcategory/havit.png";
import CoolerMaster from "@/assets/category/Bcategory/coolermaster.png";
import AMD from "@/assets/category/Bcategory/amd.png";
import Msi from "@/assets/category/Bcategory/msi.png";
import Aorus from "@/assets/category/Bcategory/aorus.png";

export default function Category() {
  const categories = [
    { name: "ASUS", image: Rog },
    { name: "Logitech", image: Logitech },
    { name: "Havit", image: Havit },
    { name: "Cooler Master", image: CoolerMaster },
    { name: "AMD", image: AMD },
    { name: "Msi", image: Msi },
    { name: "Aorus", image: Aorus },
  ];

  return (
    <div>
      <h2 className={style.title}>Supported Brands</h2>
      <p className={style.desc}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <div className={style.bcontainer}>
        {categories.map((category, index) => (
          <Link
            href={`/Categories/${encodeURIComponent(category.name)}`}
            key={index}
            className={style.Ccard}
          >
            <Image
              src={category.image}
              alt=""
              width={150}
              height={320}
              className={style.imgbC}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
