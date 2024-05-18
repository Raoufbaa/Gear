"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import style from "./page.module.css";
import ShopProduct from "@/components/Products/ShopProduct";
import ButtomHeader from "@/components/ButtomHeader/ButtomHeader";
import Image from "next/image";
import imgloading from "@/assets/product/loading.svg";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{ background: "var(--backgroundLinearGradiant)" }}>
      <Header targetTimestamp="2023-10-11T16:41:41.319Z" />
      <ShopProduct />
      <ButtomHeader />
    </div>
  );
}
