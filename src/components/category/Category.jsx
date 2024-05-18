"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";

import Jacket from "@/assets/category/COMPUTER-accessories-1024x576.jpg";
import Shoes from "@/assets/category/MB.jpg";
import Hoddie from "@/assets/category/case.png";
import diningImage from "@/assets/category/Mask Group.png";
import livingImage from "@/assets/category/Image-living room.png";
import bedroomImage from "@/assets/category/bedroom.png";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { RiArrowRightDoubleLine } from "react-icons/ri";

export default function Category() {
  const allCategories = useMemo(
    () => [
      { name: "Jacket", image: Jacket },
      { name: "MotherBoard", image: Shoes },
      { name: "Cases", image: Hoddie },
      { name: "Living", image: livingImage },
      { name: "Bedroom", image: bedroomImage },
      { name: "Bedroom", image: bedroomImage },
      { name: "Bedroom", image: bedroomImage },
      { name: "Bedroom", image: bedroomImage },
      { name: "Dining", image: diningImage },
      { name: "Living", image: livingImage },
      { name: "Living", image: livingImage },
    ],
    []
  );

  const [displayedCategories, setDisplayedCategories] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerCategory, setItemsPerCategory] = useState(3);

  useEffect(() => {
    const updateItemsPerCategory = () => {
      if (window.innerWidth < 768) {
        setItemsPerCategory(2);
      } else {
        setItemsPerCategory(3);
      }
    };

    updateItemsPerCategory();
    window.addEventListener("resize", updateItemsPerCategory);

    return () => {
      window.removeEventListener("resize", updateItemsPerCategory);
    };
  }, []);

  useEffect(() => {
    setDisplayedCategories(
      allCategories.slice(startIndex, startIndex + itemsPerCategory)
    );
  }, [allCategories, startIndex, itemsPerCategory]);

  const showNextCategories = () => {
    const newIndex = startIndex + itemsPerCategory;
    if (newIndex < allCategories.length) {
      setStartIndex(newIndex);
    }
  };

  const showPreviousCategories = () => {
    const newIndex = startIndex - itemsPerCategory;
    if (newIndex >= 0) {
      setStartIndex(newIndex);
    }
  };

  return (
    <div>
      <h2 className={style.title}>Browse The Range</h2>
      <p className={style.desc}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <div className={style.container}>
        <button
          className={style.btn}
          onClick={showPreviousCategories}
          disabled={startIndex === 0}
        >
          <RiArrowLeftDoubleFill />
        </button>
        {displayedCategories.map((category, index) => (
          <div className={style.card} key={index}>
            <Link
              className={style.underline}
              href={`/Categories/${encodeURIComponent(category.name)}`}
            >
              <Image
                src={category.image}
                alt=""
                width={280}
                height={350}
                className={style.imgC}
              />
              <h4 className={style.subtitle}>{category.name}</h4>
            </Link>
          </div>
        ))}
        <button
          onClick={showNextCategories}
          className={style.btn}
          disabled={startIndex + itemsPerCategory >= allCategories.length}
        >
          <RiArrowRightDoubleLine />
        </button>
      </div>
      <div className={style.navigation}></div>
    </div>
  );
}
