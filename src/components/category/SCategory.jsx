"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { Context } from "../context";
import { categories } from "./Data";
import { IoMdArrowRoundBack } from "react-icons/io";
import style from "./page.module.css";
import Link from "next/link";

export default function Category() {
  const { categoryMenu, setCategoryMenu } = useContext(Context);
  const [showSubMenu, setShowSubMenu] = useState(null);
  const toggleCategoryMenu = () => setCategoryMenu(!categoryMenu);
  const categoryRef = useRef(null);
  useEffect(() => {
    if (categoryMenu) {
      const closeWishlistOnClickOutside = (e) => {
        if (categoryRef.current && !categoryRef.current.contains(e.target)) {
          setCategoryMenu(false);
        }
      };

      document.addEventListener("mousedown", closeWishlistOnClickOutside);

      return () => {
        document.removeEventListener("mousedown", closeWishlistOnClickOutside);
      };
    }
  }, [categoryMenu, setCategoryMenu]);

  return (
    <main
      className={`${style.icons} ${
        categoryMenu ? style.showCategory : style.hideCategory
      }`}
      ref={categoryRef}
    >
      <IoMdArrowRoundBack
        onClick={toggleCategoryMenu}
        className={style.ivvBack}
      />
      <h1 className={style.CWtitle}>Category List</h1>
      <hr className={style.CWhr} />
      {categories.map((category, index) => (
        <div
          key={index}
          className={style.icon}
          onMouseEnter={() => setShowSubMenu(index)}
          onMouseLeave={() => setShowSubMenu(index)}
          onClick={() => {
            if (showSubMenu === index) {
              setShowSubMenu(index);
              setShowSubMenu(index);
            }
          }}
        >
          {category.icon}
          <h4 className={style.icotitle}>{category.name}</h4>
          {(showSubMenu === index || showSubMenu === true) && (
            <div
              className={style.submenu}
              style={{
                top:
                  showSubMenu === index &&
                  (index === 11 ||
                    index === 10 ||
                    index === 9 ||
                    index === 8 ||
                    index === 7)
                    ? "50%"
                    : "none",
              }}
            >
              {category.submenu.map((item, idx) => (
                <div key={idx}>
                  <Link
                    className={style.CLink}
                    href={`/Categories/${encodeURIComponent(item)}`}
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
