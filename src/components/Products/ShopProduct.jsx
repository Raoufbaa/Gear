"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";
import imgloading from "@/assets/product/loading.svg";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(
    () =>
      parseInt(
        typeof localStorage !== "undefined" &&
          localStorage.getItem("productsPerPage")
      ) || 12
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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

        const filteredProducts = processedProducts.filter((product) =>
          filterByPriceRange(product.priceInDzd, selectedPriceRange)
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, [selectedPriceRange]);

  useEffect(() => {
    typeof localStorage !== "undefined" &&
      localStorage.setItem("productsPerPage", productsPerPage.toString());
  }, [productsPerPage]);

  const filterByPriceRange = (price, selectedRange) => {
    if (!selectedRange) return true;
    const [min, max] = selectedRange
      .split("-")
      .map((val) => parseInt(val.trim()));
    return price >= min && price <= max;
  };

  const numberOfDisplayedProduct = (e) => {
    const newProductsPerPage = parseInt(e.target.value, 10);
    setProductsPerPage(newProductsPerPage);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    if (newSortBy === sortBy) {
      toggleSortOrder();
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const sortProducts = (productsToSort) => {
    if (sortBy === "name") {
      return productsToSort.slice().sort((a, b) => {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy === "price") {
      return productsToSort.slice().sort((a, b) => {
        const priceA = a.priceInDzd;
        const priceB = b.priceInDzd;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
    }
    return productsToSort;
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const filteredProducts = currentProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = sortProducts(filteredProducts);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const priceRangeOptions = [
    "All",
    "0 - 1000 DZD",
    "1000 - 5000 DZD",
    "5000 - 10000 DZD",
    "10000 - 50000 DZD",
  ];
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <div className={style.inputcontainer}>
        <div className={style.priceFilter}>
          <label className={style.PriceRangeLable} htmlFor="priceRange">
            Price Range
          </label>
          <select
            className={style.priceRange}
            id="priceRange"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            {priceRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            className={style.search}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={windowWidth < 768 ? "Search" : "Search Products Here"}
          />
        </div>
        <div className={style.rightContent}>
          <div className={style.cnumber}>
            <p className={style.Show}>Show</p>
            <input
              className={style.number}
              type="number"
              placeholder="Number of Products"
              onChange={numberOfDisplayedProduct}
              value={productsPerPage}
            />
          </div>
          <label className={style.sortlable} htmlFor="sortProducts">
            Sort By
          </label>
          <select
            className={style.sort}
            id="sortProducts"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">Default</option>
            <option value="name">Name (A-Z)</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      <h1 className={style.maintitle}>Our Products</h1>
      {loading ? (
        <>
          <Image
            className={style.loadingIMG}
            src={imgloading}
            width={120}
            height={120}
            alt=""
          />
        </>
      ) : (
        <>
          <div className={style.container}>
            <div className={style.cards}>
              {sortedProducts.map((product) => (
                <Link
                  href={`/Shop/${product.id}`}
                  key={product.id}
                  className={style.maincontainer}
                >
                  <div className={style.card}>
                    <Image
                      className={style.img}
                      src={product.thumbnail}
                      width={200}
                      height={200}
                      alt=""
                    />
                    <div className={style.container3}>
                      <h3 className={style.Ptitle}>{product.title}</h3>
                      <h5 className={style.description}>
                        {product.description}
                      </h5>
                      <h3 className={style.price}>
                        {(product.priceInDzd / 100).toLocaleString("en-US", {
                          minimumFractionDigits:
                            window.innerWidth < 768 ? 0 : 2,
                          maximumFractionDigits:
                            window.innerWidth < 768 ? 0 : 2,
                        })}{" "}
                        DZD
                      </h3>
                      <h5 className={style.qty}>Qty: {product.qty}</h5>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={style.pagination}>
        {Array.from({
          length: Math.ceil(products.length / productsPerPage),
        }).map((_, index) => (
          <button
            className={`${style.paginationbtn} ${
              currentPage === index + 1 ? style.activePage : ""
            }`}
            key={index}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
