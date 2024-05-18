"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Products({ name }) {
  const [num, setNum] = useState(8);
  const [isOpened, setIsOpened] = useState(false);
  const [products, setProducts] = useState([]);
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/products/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();

        const processedProducts = responseData.products.map((product) => {
          const pricesInDzd = product.variants[0].prices.find(
            (price) => price.currency_code === "dzd"
          );
          const priceInDzd = pricesInDzd ? pricesInDzd.amount : 0;
          const qty = product.variants[0].inventory_quantity;

          return {
            ...product,
            priceInDzd,
            qty,
          };
        });

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  let randomStartIndex;
  if (products.length <= 10) {
    randomStartIndex = Math.floor(Math.random() * 3);
  } else if (products.length > 10) {
    randomStartIndex = Math.floor(Math.random() * 6);
  } else if (products.length >= 20) {
    randomStartIndex = Math.floor(Math.random() * 9);
  } else {
    randomStartIndex = Math.floor(Math.random() * 12);
  }

  const toggleShowMore = () => {
    if (isOpened) {
      setNum(8);
    } else {
      const newStartIndex = randomStartIndex + num;
      setNum(newStartIndex + 4);
    }
    setIsOpened(!isOpened);
  };

  const getAnimationVariant = () => {
    if (!inView) {
      return {
        opacity: 0,
        y: 50,
      };
    } else {
      if (isOpened) {
        return {
          opacity: 1,
          y: 0,
          scale: 1,
        };
      } else {
        return {
          opacity: 1,
          y: 0,
          scale: 1.05,
        };
      }
    }
  };
  return (
    <div>
      <h1 className={style.maintitle}>{name}</h1>
      <div className={style.container}>
        <div
          ref={ref}
          style={{
            height:
              isOpened && window.innerWidth < 768
                ? "1170px"
                : isOpened
                ? "1148px"
                : "780px",
          }}
          className={style.cards}
        >
          {products
            .slice(randomStartIndex, randomStartIndex + num)
            .map((product) => (
              <Link
                href={`/Shop/${product.id}`}
                key={product.id}
                className={style.maincontainer}
              >
                <motion.div
                  key={product.id}
                  className={style.card}
                  animate={getAnimationVariant()}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    className={style.img}
                    src={product.thumbnail}
                    width={600}
                    height={220}
                    alt=""
                    priority
                  />
                  <div
                    style={{
                      width: isOpened ? "231px" : "219px",
                      marginLeft: isOpened ? "0px" : "6px",
                      position: "relative",
                      top: !isOpened ? "7px" : "0px",
                    }}
                    className={style.container2}
                  >
                    <h3 className={style.Ptitle}>{product.title}</h3>
                    <h5 className={style.description}>{product.description}</h5>
                    <h3 className={style.price}>
                      {(product.priceInDzd / 100).toLocaleString("en-US", {
                        minimumFractionDigits: window.innerWidth < 768 ? 0 : 2,
                        maximumFractionDigits: window.innerWidth < 768 ? 0 : 2,
                      })}{" "}
                      DZD
                    </h3>

                    <h5 className={style.qty}>Qty: {product.qty}</h5>
                  </div>
                </motion.div>
              </Link>
            ))}
        </div>

        <div className={style.centerButton}>
          <button className={style.btn} onClick={toggleShowMore}>
            {isOpened ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </div>
  );
}
