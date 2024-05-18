"use client";
import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import ProductSlider from "./ProductSlider"; // Import the ProductSlider component

export default function Header() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/store/products/`)
      .then((response) => response.json())
      .then((data) => {
        // Sort the products by creation time (latest first) and take the top 4
        const sortedProducts = data.products.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA;
        });

        const newProducts = sortedProducts.slice(0, 4);

        // Pass an array of objects containing product data and IDs to the ProductSlider
        const productsWithIds = newProducts.map((product) => ({
          ...product,
          id: product.id, // Adding ID to the product object
        }));

        setProducts(productsWithIds);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className={style.header}>
      <div className={style.imageContainer}>
        <div className={style.overlayContent}>
          <h2 className={style.titletext}>New Products</h2>
          <ProductSlider products={products} />
        </div>
      </div>
    </div>
  );
}
