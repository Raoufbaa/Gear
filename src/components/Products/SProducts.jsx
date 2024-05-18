"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";

import { useSession } from "next-auth/react";

export default function Products({ name }) {
  const [num, setNum] = useState(4);
  const [isOpened, setIsOpened] = useState(false);
  const [products, setProducts] = useState([]);
  const { data } = useSession();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/products/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok"); // Use "new Error" instead of "an Error"
        }
        const responseData = await response.json();

        // Process the products and their prices and quantity
        const processedProducts = responseData.products.map((product) => {
          // Find prices in "dzd"
          const pricesInDzd = product.variants[0].prices.find(
            (price) => price.currency_code === "dzd"
          );

          // If there is a price in "dzd," return it; otherwise, return 0
          const priceInDzd = pricesInDzd ? pricesInDzd.amount : 0;

          // Find quantity (qty) for the product
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

  return (
    <div>
      <h1 className={style.maintitle}>{name}</h1>
      <div className={style.container}>
        <div
          style={{ height: isOpened ? "745px" : "360px" }}
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
                <div key={product.id} className={style.card}>
                  <Image
                    className={style.img}
                    src={product.thumbnail}
                    width={150}
                    height={200}
                    alt=""
                    priority
                  />
                  <div className={style.container3}>
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
                </div>
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
