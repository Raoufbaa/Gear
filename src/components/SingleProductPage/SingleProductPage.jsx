"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Product from "@/assets/product/Product.png";
import { Context } from "../context";
import { useSession } from "next-auth/react";
import { AiOutlineHeart } from "react-icons/ai";
import styles from "./page.module.css";
import Products from "@/components/Products/SProducts";
import imgloading from "@/assets/product/CartLoading.svg";
import Mainloading from "@/assets/nav/loading.svg";

export default function SingleProductPage({ params }) {
  const [responseData, setResponseData] = useState(null);
  const { loadingTimer } = useContext(Context);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [mobileInfo, setMobileInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const { handleAddToWishlist, wishlistItem, setCartEffect } =
    useContext(Context);
  const [loading, setLoading] = useState(false);

  const cartData =
    typeof localStorage !== "undefined" &&
    JSON.parse(localStorage.getItem("cart_data")); // Parse the cart data from localStorage

  useEffect(() => {
    async function fetchData(id) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/store/products/${id}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setResponseData(data.product);
        setSelectedImage(data.product.thumbnail);
        setSelectedVariant(data.product.variants[0]);
        // Find and set the initial selected variant price in DZD
        const dzdPrice = data.product.variants[0].prices.find(
          (price) => price.currency_code === "dzd"
        );

        if (dzdPrice) {
          setSelectedVariantPrice(dzdPrice.amount);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData(params.id);
  }, [params.id]);
  useEffect(() => {
    const findVariantByOptions = () => {
      // Check if options are selected
      if (Object.keys(selectedOptions).length === 0) return null;
      if (!responseData || !responseData.variants) return null;

      return responseData.variants.find((variant) => {
        return variant.options.every((option) => {
          return selectedOptions[option.option_id] === option.value;
        });
      });
    };

    setSelectedVariant(findVariantByOptions());
  }, [selectedOptions, responseData]);
  const findVariantByOptions = () => {
    // Check if options are selected
    if (Object.keys(selectedOptions).length === 0) return null;
    if (!responseData || !responseData.variants) return null;

    return responseData.variants.find((variant) => {
      return variant.options.every((option) => {
        return selectedOptions[option.option_id] === option.value;
      });
    });
  };

  // Function to handle option select
  const handleOptionSelect = (optionId, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionId]: value,
    }));

    // Find and set the selected variant based on selected options
    const variant = findVariantByOptions();
    setSelectedVariant(variant);
  };
  const handleSubImageClick = (imageURL) => {
    setSelectedImage(imageURL);
  };
  const { setCid } = useContext(Context);

  const HandleCreateCart = async () => {
    const selectedVariant = findVariantByOptions();
    if (!selectedVariant) {
      console.error("No variant selected.");
      return;
    }
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts`;
      const region_id = process.env.NEXT_PUBLIC_COUNTRY_ID;
      console.log("reg", region_id);
      if (selectedVariant) {
        const requestData = {
          region_id: region_id,
          country_code: "DZ",
          items: [
            {
              variant_id: selectedVariant.id,
              quantity,
            },
          ],
        };

        if (cartData && cartData.customer_id === session.id) {
          // If cartData is not empty, update the existing cart
          const cartId = cartData.id; // Assuming the first cart in the array
          const updateCartUrl = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartId}/line-items`;
          const updateData = {
            variant_id: requestData.items[0].variant_id,
            quantity: requestData.items[0].quantity,
          };

          const updateResponse = await fetch(updateCartUrl, {
            method: "POST", // Use PUT to update the cart
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });

          if (updateResponse.ok) {
            console.log("Cart updated with new item");
            setCartEffect((prev) => prev + 1);
          } else {
            console.error(
              "Failed to update cart. Status:",
              updateResponse.status
            );
          }
        } else {
          // If cartData is empty, create a new cart
          const response = await fetch(apiUrl, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            // Parse the cart data to get the cart ID
            const cart = await response.json();
            const cartId = cart.cart.id;
            console.log("cart_id", cartId);
            console.log("Session", session.id);
            // Make a new request to update the cart with customer information
            const updateCartUrl = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartId}`;

            let updateData;

            if (session.id.startsWith("cus")) {
              updateData = {
                customer_id: session.id,
              };
            } else {
              updateData = {
                email: session.user.email,
              };
            }

            const updateResponse = await fetch(updateCartUrl, {
              method: "POST", // Use POST to update the cart
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            });

            if (updateResponse.ok) {
              console.log("localstorage", cart.cart.id);
              localStorage.setItem("cart_id", cart.cart.id);
              console.log("Cart updated with customer information");
              setCid(cart.cart.id);
              // window.location.reload();
              setCartEffect((prev) => prev + 1);
            } else {
              console.error(
                "Failed to update cart with customer information. Status:",
                updateResponse.status
              );
            }
          } else {
            console.error("Failed to create cart. Status:", response.status);
          }
        }
      } else {
        console.error("No variant selected.");
      }
    } catch (error) {
      console.error("Error creating/updating the cart:", error);
    }
  };

  let subImages = [];

  if (responseData) {
    subImages = responseData.images
      .slice(0, 4)
      .map((image) => (
        <Image
          key={image.id}
          src={image.url}
          width={130}
          height={130}
          alt={responseData.title}
          onClick={() => handleSubImageClick(image.url)}
          className={selectedImage === image.url ? styles.selectedImage : ""}
          priority
        />
      ));
  }

  while (subImages.length < 4) {
    subImages.push(
      <Image
        key={`placeholder-${subImages.length}`}
        src={Product}
        width={130}
        height={130}
        alt="there are errors with this image"
        priority
      />
    );
  }

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);

    // Update the selected variant's price to be in DZD
    const dzdPrice = variant.prices.find(
      (price) => price.currency_code === "dzd"
    );

    if (dzdPrice) {
      setSelectedVariantPrice(dzdPrice.amount);
    } else {
      setSelectedVariantPrice(null);
    }
  };
  useEffect(() => {
    window.innerWidth < 768 ? setMobileInfo(true) : setMobileInfo(false);
  }, [mobileInfo]);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);
  const variants =
    responseData && responseData.variants ? responseData.variants : undefined;
  return (
    <div>
      <div className={styles.productPage}>
        <div className={styles.mainImageColumn}>
          {!mobileInfo ? (
            <div className={styles.imageColumn}>{subImages}</div>
          ) : null}
          <div className={styles.mainImage}>
            {selectedImage ? (
              <div className={styles.zoomedImage}>
                <Image
                  src={selectedImage}
                  width={510}
                  height={520}
                  className={styles.selectedIMG}
                  alt={responseData ? responseData.title : ""}
                  priority
                />
              </div>
            ) : (
              <Image
                src={Product}
                width={600}
                height={620}
                alt={responseData ? responseData.title : ""}
                priority
              />
            )}
          </div>
          {mobileInfo ? (
            <div className={styles.imageColumn}>{subImages}</div>
          ) : null}

          {loadingTimer ? (
            <Image src={Mainloading} alt="" height={600} />
          ) : (
            responseData && (
              <div className={styles.imageInfo}>
                <h2>{responseData.title}</h2>
                <p>{responseData.description}</p>

                <div className={styles.variantRow}>
                  {responseData.options &&
                    responseData.options.map((option) => {
                      const uniqueValues = new Set();
                      option.values.forEach((value) => {
                        uniqueValues.add(value.value);
                      });

                      const uniqueValuesArray = Array.from(uniqueValues);

                      return (
                        <select
                          className={styles.variant}
                          key={option.id}
                          value={selectedOptions[option.id] || ""}
                          onChange={(e) =>
                            handleOptionSelect(option.id, e.target.value)
                          }
                        >
                          <option className={styles.variant} value="">
                            Select {option.title}
                          </option>
                          {uniqueValuesArray.map((uniqueValue, index) => (
                            <option
                              className={styles.variant}
                              key={index}
                              value={uniqueValue}
                            >
                              {uniqueValue}
                            </option>
                          ))}
                        </select>
                      );
                    })}
                </div>

                {selectedVariant ? (
                  selectedVariant.inventory_quantity === 0 ? (
                    <p className={styles.price}>Out of stock</p>
                  ) : selectedVariant.prices.find(
                      (price) => price.currency_code === "dzd"
                    ) ? (
                    <p className={styles.price}>
                      Price:{" "}
                      {(
                        selectedVariant.prices.find(
                          (price) => price.currency_code === "dzd"
                        ).amount / 100
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      DZD
                    </p>
                  ) : (
                    <p className={styles.price}>Price not available in DZD</p>
                  )
                ) : (
                  <p className={styles.price}>This variant is not available</p>
                )}

                <div>
                  {selectedVariant ? (
                    selectedVariant.inventory_quantity > 0 ? (
                      selectedVariant.prices.find(
                        (price) => price.currency_code === "dzd"
                      ) ? (
                        <button
                          className={styles.createCartBtn}
                          onClick={() => {
                            HandleCreateCart();
                            setLoading(true);
                          }}
                          disabled={!session}
                        >
                          {loading ? (
                            <>
                              <h3> Add to cart</h3>

                              <Image
                                className={styles.loadingIMG}
                                src={imgloading}
                                width={68}
                                height={68}
                                alt=""
                              />
                            </>
                          ) : (
                            <h3> Add to cart</h3>
                          )}
                        </button>
                      ) : (
                        <button className={styles.createCartBtn} disabled>
                          Price not available in DZD
                        </button>
                      )
                    ) : (
                      <button className={styles.createCartBtn} disabled>
                        Out of stock
                      </button>
                    )
                  ) : (
                    <button className={styles.createCartBtn} disabled>
                      Select Options
                    </button>
                  )}

                  <input
                    className={styles.quantity}
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <button
                    className={styles.addToWishlistBtn}
                    disabled={
                      responseData
                        ? wishlistItem.findIndex(
                            (item) => item.id === responseData.id
                          ) !== -1
                        : true
                    }
                    onClick={() => handleAddToWishlist(responseData)}
                  >
                    <AiOutlineHeart />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <h1 className={styles.addition}>Additional information</h1>
      <div className={styles.additionalInfoContainer}>
        <div className="infoWrapper">
          {responseData && (
            <div className={`imageInfo ${styles.additionalInfo}`}>
              <h2 className={styles.title}>{responseData.title}</h2>
              <h2 className={styles.sub}>{responseData.subtitle}</h2>
              <h2 className={styles.des}>{responseData.description}</h2>
              <div className={styles.detailsRow}>
                <p className={styles.height}>Height: {responseData.height}</p>
                <p className={styles.width}>Width: {responseData.width}</p>
                <p className={styles.length}>Length: {responseData.length}</p>
                <p className={styles.weight}>Weight: {responseData.weight}</p>
              </div>
              <div className={styles.other}>
                <p className={styles.hand}>
                  <span className={styles.Ospan}>Handle:</span>{" "}
                  {responseData.handle}
                </p>
                <p className={styles.collec}>
                  <span className={styles.Ospan}>Collection:</span>
                  {responseData.collection}
                </p>
                <p className={styles.material}>
                  <span className={styles.Ospan}>Material:</span>{" "}
                  {responseData.material}
                </p>
                <p className={styles.origin}>
                  <span className={styles.Ospan}>Country:</span>{" "}
                  {responseData.origin_country}
                </p>
                <p className={styles.var}>
                  <span className={styles.Ospan}>Qty:</span>{" "}
                  {responseData.variants[0].inventory_quantity} in stock
                </p>
                <p>
                  <span className={styles.Ospan}>Price Around </span>
                  <span className={styles.price}>
                    {selectedVariantPrice !== null
                      ? `${(selectedVariantPrice / 100).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )} DZD`
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Products name={"Recommended Products"} />
    </div>
  );
}
function getPriceInDZD(responseData) {
  if (responseData) {
    const variants = responseData.variants;
    const dzdPrice = variants.map((variant) => {
      const dzdPriceData = variant.prices.find(
        (price) => price.currency_code === "dzd"
      );
      return dzdPriceData ? dzdPriceData.amount : "N/A";
    });

    return dzdPrice.length > 0 ? dzdPrice[0] : "N/A";
  } else {
    return "N/A";
  }
}
