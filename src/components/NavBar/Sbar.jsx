"use client";
import { useState, useContext } from "react";
import { Context } from "../context";
import style from "@/components/NavBar/page.module.css";
import SCategory from "@/components/category/SCategory";
import { TbCategoryPlus } from "react-icons/tb";

function Sbar() {
  const { categoryMenu, setCategoryMenu } = useContext(Context);
  const toggleCategoryMenu = () => setCategoryMenu(!categoryMenu);

  return (
    <div>
      {categoryMenu ? <SCategory /> : null}
      <button className={style.Cbutton} onClick={toggleCategoryMenu}>
        <TbCategoryPlus />
      </button>
    </div>
  );
}

export default Sbar;
