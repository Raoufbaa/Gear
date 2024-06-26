"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import style from "./page.module.css";
import Link from "next/link";
import imgloading from "@/assets/product/loading.svg";

export default function Products(params) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productsPerPage, setProductsPerPage] = useState(() =>
    typeof localStorage !== "undefined"
      ? parseInt(localStorage.getItem("productsPerPage")) || 3
      : 3
  );

  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortBy, setSortBy] = useState(""); // Sorting option: 'name' or 'price'
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order: 'asc' or 'desc'
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/products/`
        );
        if (!productsResponse.ok) {
          throw new Error("Network response for products was not ok");
        }
        const productsData = await productsResponse.json();

        const processedProducts = productsData.products.map((product) => {
          const pricesInDzd = product.variants[0].prices.find(
            (price) => price.currency_code === "dzd"
          );

          const priceInDzd = pricesInDzd ? pricesInDzd.amount : 0;
          const qty = product.variants[0].inventory_quantity;

          return {
            ...product,
            priceInDzd,
            qty,
            categories: [], // Initialize categories as empty array
          };
        });

        setProducts(processedProducts);

        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/products?expand=categories`
        );
        if (!categoriesResponse.ok) {
          throw new Error("Network response for categories was not ok");
        }
        const categoriesData = await categoriesResponse.json();

        // Match categories to products based on product ID
        processedProducts.forEach((product) => {
          const matchingProduct = categoriesData.products.find(
            (p) => p.id === product.id
          );
          if (matchingProduct) {
            product.categories = matchingProduct.categories;
          }
        });

        // Now you have products with categories
        // Filter and set products based on selected category and price range
        const filteredByCategory = processedProducts.filter((product) =>
          product.categories.some(
            (category) => category.name === params.params.name
          )
        );

        const filteredByPrice = filteredByCategory.filter((product) =>
          filterByPriceRange(product.priceInDzd, selectedPriceRange)
        );

        setProducts(filteredByPrice);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts().then(() => {
      setLoading(false);
    });
  }, [selectedPriceRange, params.params.name]);

  useEffect(() => {
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

      <h1 className={style.maintitle}>{params.params.name} Side</h1>
      <div className={style.container}>
        <div className={style.cards}>
          {loading ? (
            <>
              <Image
                className={style.CloadingIMG}
                src={imgloading}
                width={120}
                height={120}
                alt=""
              />
            </>
          ) : (
            <>
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
                      width={150}
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
            </>
          )}
        </div>
      </div>
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
