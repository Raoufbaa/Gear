"use client";
import { useEffect, useState } from "react";
import style from "./page.module.css";
import Image from "next/image";
import setup from "@/assets/category/Bcategory/setup.png";
import amdPlaceholder from "@/assets/product/Product.png";
import Link from "next/link";

function SetupCategory() {
  const [prebuiltProducts, setPrebuiltProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxProductsToShow = 4;

  useEffect(() => {
    async function fetchPrebuiltProducts() {
      try {
        const response = await fetch(
          "http://localhost:9000/store/products?expand=categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const filteredProducts = data.products.filter((product) => {
          return product.categories.some(
            (category) => category.name === "PreBuilt"
          );
        });
        const prebuiltProducts = filteredProducts.slice(0, maxProductsToShow);
        setPrebuiltProducts(prebuiltProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prebuilt products:", error);
        setLoading(false);
      }
    }

    fetchPrebuiltProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.setupContainer}>
      <Link href={"/"}>
        <div className={style.setupImageContainer}>
          <Image
            className={style.setupImg}
            src={setup}
            width={250}
            height={450}
            alt="Prebuilt Image for setup categories"
          />
          <div className={style.setupText}>
            <h2>Browse Our PreBuilt PCs with the Latest Features</h2>
          </div>
        </div>
      </Link>
      <div className={style.flex}>
        <div style={{ display: "flex" }}>
          <h3 className={style.header}>
            Best Prebuilt Office or Gaming PCs You Can Buy Today
          </h3>
          <Link href={"/Shop"} className={style.shopLink}>
            More Products
          </Link>
        </div>
        <div className={style.prebuildflex}>
          {prebuiltProducts.map((product) => (
            <Link
              href={`/Shop/${product.id}`}
              key={product.id}
              className={style.prebuiltContianer}
            >
              <div>
                <Image
                  className={style.thumbnail}
                  src={product.thumbnail}
                  alt="PreBuilt PCs Here"
                  width={145}
                  height={190}
                />
              </div>
              <h3 className={style.preTitle}>{product.title}</h3>
              <Link className={style.cardLink} href={`/Shop/${product.id}`}>
                More info
              </Link>
            </Link>
          ))}
          {prebuiltProducts.length < maxProductsToShow &&
            Array(maxProductsToShow - prebuiltProducts.length)
              .fill()
              .map((_, index) => (
                <div key={index} className={style.prebuiltContianer}>
                  <div>
                    <Image
                      className={style.thumbnail}
                      src={amdPlaceholder}
                      alt="PreBuilt PCs Here"
                      width={145}
                      height={190}
                    />
                  </div>
                  <h3 className={style.preTitle}>Place Holder</h3>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default SetupCategory;
