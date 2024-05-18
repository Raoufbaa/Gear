"use client";
import { useState, useEffect, useContext } from "react";
import { Context } from "@/components/context";
import dynamic from "next/dynamic";
import Image from "next/image";
import itsDarkIcon from "@/assets/nav/loading.svg";
import style from "@/app/Checkout/page.module.css";
const CartData = dynamic(() => import("@/components/Prop/Checkout"), {
  ssr: false,
});

const Page = () => {
  const { loadingTimer } = useContext(Context);

  return (
    <>
      {loadingTimer ? (
        <Image
          className={style.loadingivv}
          src={itsDarkIcon}
          alt=""
          height={600}
        />
      ) : (
        <CartData />
      )}
    </>
  );
};

export default Page;
