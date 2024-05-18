"use client";
import { useState, useContext } from "react";
import { BiSun } from "react-icons/bi";
import { BiMoon } from "react-icons/bi";
import style from "../NavBar/page.module.css";
import { Context } from "../context";
import { useTheme } from "next-themes";

function IsItDark() {
  const { isItDark, setisItDark } = useContext(Context);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (isItDark) {
      setTheme("light");
      setisItDark(false);
    } else {
      setTheme("dark");
      setisItDark(true);
    }
  };
  return (
    <>
      {isItDark ? (
        <BiSun className={style.ivv} onClick={toggleTheme} />
      ) : (
        <BiMoon className={style.ivv} onClick={toggleTheme} />
      )}
    </>
  );
}

export default IsItDark;
