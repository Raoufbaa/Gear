"use client";
import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Category from "@/components/category/Category";
import Products from "@/components/Products/Products";
import BCategory from "@/components/category/BCategory";
import { getServerSession } from "next-auth";
import { option } from "./api/auth/[...nextauth]/options";
import { BiCategory } from "react-icons/bi";
import Image from "next/image";
import imgloading from "@/assets/product/loading.svg";
import { Context } from "../components/context";
import HeroStatic from "@/components/Hero/HeroStatic";
import SetupCategorie from "@/components/category/SetupCategorie";

const Hero = dynamic(() => import("@/components/Hero/Hero"), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { loadingTimer, setLoadingTimer } = useContext(Context);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.main}>
      {loadingTimer ? <HeroStatic /> : <Hero />}
      <Category />
      {loading ? (
        <>
          <h1 className={styles.maintitle}>Our Products</h1>
          <Image
            className={styles.loadingIMG}
            src={imgloading}
            width={120}
            height={120}
            alt=""
          />
        </>
      ) : (
        <>
          <Products className={styles.loadComponent} name={"Our Products"} />
        </>
      )}
      <SetupCategorie />
      <BCategory />
    </main>
  );
}
