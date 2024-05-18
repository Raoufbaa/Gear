"use client";
import { useEffect, useState, useContext } from "react";
import { Context } from "@/components/context";
import { useSession } from "next-auth/react";
import style from "@/app/Checkout/page.module.css";
import Image from "next/image";
import ButtomHeader from "@/components/ButtomHeader/ButtomHeader";
import banner from "@/assets/checkout/banner.svg";
import axios from "axios";
import SavedShippingAddress from "../UpdateProfile/SavedShippingAdress";

export default function Checkout() {
  const { data: session } = useSession();
  let cartData =
    typeof localStorage !== "undefined" &&
    JSON.parse(localStorage.getItem("cart_data"));
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage] = useState("");
  const [errmessage, setErrMessage] = useState("");
  const { setCartData, setCartDataReset, setSelectedAddress, selectedAddress } =
    useContext(Context);
  const [storedSelectedAddress, setStoredSelectedAddress] = useState(
    typeof localStorage !== "undefined" &&
      JSON.parse(localStorage.getItem("selectedAddress"))
  );
  const apiKey = process.env.NEXT_PUBLIC_SlickPAY_API_KEY;

  const [shippingOptions, setShippingOptions] = useState([]);

  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
  });

  // Handler for form field changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const updateCartWithNewAddress = (event) => {
    if (event) {
      event.preventDefault();
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}`;

    // Make the POST request to update the shipping address
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipping_address: newAddress,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle success response here
          console.log("Shipping address updated successfully");
          // Update the local storage with the new address
          setStoredSelectedAddress(newAddress);
          localStorage.setItem("selectedAddress", JSON.stringify(newAddress));
        } else {
          // Handle error response here
          console.error("Failed to update shipping address");
        }
      })
      .catch((error) => {
        // Handle network or other errors
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    if (cartData && cartData.id) {
      // Fetch shipping options when component mounts
      const fetchShippingOptions = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND}/store/shipping-options/${cartData.id}`
          );
          // Extract shipping_options array from the response and set it to shippingOptions state
          setShippingOptions(response.data.shipping_options || []);
        } catch (error) {
          console.error("Error fetching shipping options:", error);
        }
      };
      fetchShippingOptions();
    }
  }, [cartData && cartData.id]);

  const updateOrderWithShippingOption = async (e) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/shipping-methods`;
      await axios.post(url, { option_id: e.target.value });
      console.log("Shipping option updated successfully");
    } catch (error) {
      console.error("Error updating shipping option:", error);
    }
  };

  useEffect(() => {
    if (cartData && session && cartData.customer_id === session.id) {
      if (storedSelectedAddress) {
        // Define the URL for the POST request
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}`;

        // Make the POST request to update the shipping address
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipping_address: {
              first_name: storedSelectedAddress.first_name,
              last_name: storedSelectedAddress.last_name,
              phone: storedSelectedAddress.phone,
              company: storedSelectedAddress.company,
              address_1: storedSelectedAddress.address_1,
              address_2: storedSelectedAddress.address_2,
              city: storedSelectedAddress.city,
              country_code: "dz",
              province: storedSelectedAddress.province,
              postal_code: storedSelectedAddress.postal_code,
            },
          }),
        })
          .then((response) => {
            if (response.ok) {
              // Handle success response here
              console.log("Shipping address updated successfully");
            } else {
              // Handle error response here
              console.error("Failed to update shipping address");
            }
          })
          .catch((error) => {
            // Handle network or other errors
            console.error("Error:", error);
          });
      }
    }
  }, [session, storedSelectedAddress, cartData]);
  useEffect(() => {
    if (session && storedSelectedAddress) {
      if (session.id !== storedSelectedAddress.customer_id) {
        setStoredSelectedAddress(null);
        localStorage.setItem(
          "selectedAddress",
          JSON.stringify(storedSelectedAddress)
        );
      }
    }
  }, [session, storedSelectedAddress]);

  const submitPayment = async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Check if the necessary user information is available
    if (
      !newAddress.first_name ||
      !newAddress.last_name ||
      !newAddress.phone ||
      !newAddress.address_1 ||
      !newAddress.city ||
      !newAddress.province ||
      !newAddress.postal_code
    ) {
      // If any of the required information is missing, display an error message and return
      setErrMessage("Hey! Looks like we need your address.");
      setTimeout(() => {
        setErrMessage();
      }, 4000);
      return;
    }

    try {
      await updateCartWithNewAddress();

      const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/payment-sessions`;
      const urlcomplete = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/complete`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("Payment session created for cart ID:", cartData.id);

      await fetch(urlcomplete, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      console.log("Cart completed ");
      setMessage("Checkout Complete");
    } catch (error) {
      console.error("Error handling payment:", error);
      setErrMessage("Failed To Complete Checkout");
      setTimeout(() => {
        setErrMessage();
      }, 4000);
    }
    setCartDataReset((prev) => prev + 1);
    setCartData(null);
  };

  const submitPaymentSaved = async (event) => {
    event.preventDefault();

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/payment-sessions`;
      const urlcomplete = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/complete`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("Payment session created for cart ID:", cartData.id);

      await fetch(urlcomplete, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("cart completed ");
      setMessage("Checkout Complete");
    } catch (error) {
      console.error("Error handling payment:", error);
      setErrMessage("Failed To Complete Checkout");
    }
    setCartDataReset((prev) => prev + 1);
    setCartData(null);
  };
  useEffect(() => {
    setTimeout(() => {
      if (!session) {
        setSelectedAddress(null);
        localStorage.removeItem("selectedAddress");
      } else {
      }
    }, 4000);
  }, [session, selectedAddress, setSelectedAddress]);

  /*----------------------------------------*/
  const submitPaymentForm = async (event) => {
    event.preventDefault();
    let accountID; // Declare accountID outside try blocks

    const generateRandomRib = () => {
      const ribLength = 20;
      let rib = "";
      for (let i = 0; i < ribLength; i++) {
        rib += Math.floor(Math.random() * 10);
      }
      return rib;
    };

    // Check if the necessary user information is available
    if (
      !newAddress.first_name ||
      !newAddress.last_name ||
      !newAddress.phone ||
      !newAddress.address_1 ||
      !newAddress.city ||
      !newAddress.province ||
      !newAddress.postal_code
    ) {
      // If any of the required information is missing, display an error message and return
      setErrMessage("Hey! Looks like we need your address.");
      setTimeout(() => {
        setErrMessage();
      }, 4000);
      return;
    }

    try {
      const response = await axios.post(
        "https://prodapi.slick-pay.com/api/v2/users/accounts",
        {
          rib: generateRandomRib(),
          title: "Mr",
          firstname: session.name,
          lastname: session.Last_name,
          address: "address of customer",
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      accountID = response.data.uuid;
    } catch (error) {
      console.error("Error creating account:", error);
      // Display a meaningful error message
      setErrMessage("Failed to create account. Please try again later.");
      setTimeout(() => {
        setErrMessage();
      }, 4000);
      return; // Return early if there's an error
    }

    try {
      const checkout = await axios.post(
        "https://prodapi.slick-pay.com/api/v2/users/invoices",
        {
          amount: cartData.tax_total / 100,
          account: accountID,
          firstname: session.name,
          lastname: session.Last_name,
          phone: newAddress.phone,
          email: session.email,
          address: "a Customer address",
          items: cartData.items.map((item) => ({
            name: item.title,
            price: item.unit_price / 100,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      console.log(checkout.data.invoice.url);
      window.location.href = checkout.data.invoice.url;
    } catch (error) {
      console.error("Error creating checkout:", error);
      // Display a meaningful error message
      setErrMessage("Failed to create checkout. Please try again later.");
      setTimeout(() => {
        setErrMessage();
      }, 4000);
    }

    try {
      await updateCartWithNewAddress();

      const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/payment-sessions`;
      const urlcomplete = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/complete`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("Payment session created for cart ID:", cartData.id);

      await fetch(urlcomplete, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      console.log("Cart completed ");
      setMessage("Checkout Complete");
    } catch (error) {
      console.error("Error handling payment:", error);
      setErrMessage("Failed To Complete Checkout");
      setTimeout(() => {
        setErrMessage();
      }, 4000);
    }
    setCartDataReset((prev) => prev + 1);
    setCartData(null);
  };

  /*----------------------------------------*/
  const submitPaymentFormSaved = async (event) => {
    event.preventDefault();
    let accountID; // Declare accountID outside try blocks
    const generateRandomRib = () => {
      const ribLength = 20;
      let rib = "";
      for (let i = 0; i < ribLength; i++) {
        rib += Math.floor(Math.random() * 10);
      }
      return rib;
    };
    try {
      const response = await axios.post(
        "https://prodapi.slick-pay.com/api/v2/users/accounts",
        {
          rib: generateRandomRib(),
          title: "Mr",
          firstname: session.name,
          lastname: session.Last_name,
          address: "address of customer",
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      accountID = response.data.uuid;
    } catch (error) {
      console.error("Error creating account:", error);
    }
    try {
      const checkout = await axios.post(
        "https://prodapi.slick-pay.com/api/v2/users/invoices",
        {
          amount: cartData.total / 100,
          account: accountID,
          firstname: session.name,
          lastname: session.Last_name,
          phone: storedSelectedAddress.phone,
          email: session.email,
          address: "a Customer address",
          items: cartData.items.map((item) => ({
            name: item.title,
            price: item.unit_price / 100,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      console.log(checkout.data.invoice.url);
      window.location.href = checkout.data.invoice.url;
    } catch (error) {
      console.error("Error creating checkout:", error); // Fix error message here
    }

    event.preventDefault();

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/payment-sessions`;
      const urlcomplete = `${process.env.NEXT_PUBLIC_BACKEND}/store/carts/${cartData.id}/complete`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("Payment session created for cart ID:", cartData.id);

      await fetch(urlcomplete, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("cart completed ");
      setMessage("Checkout Completed");
    } catch (error) {
      console.error("Error handling payment:", error);
      setErrMessage("Failed To Complete Checkout");
    }
    setCartDataReset((prev) => prev + 1);
    setCartData(null);
  };
  /*----------------------------------------*/
  return (
    <div>
      <h1 className={style.CWtitle}>Check Out</h1>
      <hr className={style.CWhr} />
      <main className={style.flex}>
        <div className={style.infocard}>
          <div className={style.forms}>
            {!storedSelectedAddress ? (
              <div className={style.lex}>
                <form className={style.form}>
                  <h2 className={style.title}>Add a New Shipping Address</h2>
                  <div className={style.formGroup}>
                    <div className={style.inputRow}>
                      <input
                        className={style.input}
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="First Name"
                        value={newAddress.first_name}
                        onChange={handleAddressChange}
                        required
                      />
                      <input
                        className={style.input}
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name"
                        value={newAddress.last_name}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  <div className={style.formGroup}>
                    <select
                      className={style.input}
                      id="shippingOption"
                      name="shippingOption"
                      onChange={updateOrderWithShippingOption}
                      required
                    >
                      <option value="">Select Shipping Option</option>
                      {shippingOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={style.formGroup}>
                    <input
                      className={style.input}
                      type="number"
                      id="phone"
                      name="phone"
                      placeholder="Phone"
                      value={newAddress.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className={style.formGroup}>
                    <input
                      className={style.input}
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Company"
                      value={newAddress.company}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className={style.formGroup}>
                    <div className={style.inputRow}>
                      <input
                        className={style.input}
                        type="text"
                        id="address_1"
                        name="address_1"
                        placeholder="Address Line 1"
                        value={newAddress.address_1}
                        onChange={handleAddressChange}
                        required
                      />
                      <input
                        className={style.input}
                        type="text"
                        id="address_2"
                        name="address_2"
                        placeholder="Address Line 2 (Optional)"
                        value={newAddress.address_2}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>

                  <div className={style.formGroup}>
                    <input
                      className={style.input}
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className={style.formGroup}>
                    <input
                      className={style.input}
                      type="text"
                      id="province"
                      name="province"
                      placeholder="Province"
                      value={newAddress.province}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className={style.formGroup}>
                    <input
                      className={style.input}
                      type="number"
                      id="postal_code"
                      name="postal_code"
                      placeholder="Postal Code"
                      value={newAddress.postal_code}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  {/* 
                  <button
                    className={style.btn}
                    onClick={updateCartWithNewAddress}
                  >
                    Update Address
                  </button> */}
                </form>
                <div>
                  <p className={style.products}>Products</p>
                  {cartData && cartData.items.length > 0
                    ? cartData.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <div>
                            <section>
                              <h4 className={style.Pname}>
                                {item.title}{" "}
                                <span className={style.Pricespan}>
                                  {item.quantity}X
                                  {(
                                    item.subtotal /
                                    100 /
                                    item.quantity
                                  ).toLocaleString("en-US", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </h4>
                            </section>
                          </div>
                        </div>
                      ))
                    : null}
                  <p className={style.total}>
                    {cartData ? (
                      <span>
                        SubTotal:{" "}
                        {(cartData.subtotal / 100).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        DZD
                      </span>
                    ) : null}
                  </p>
                  <p className={style.total}>
                    {cartData ? (
                      <span>
                        {" "}
                        TaxTotal:
                        {(cartData.tax_total / 100).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        DZD
                      </span>
                    ) : null}
                  </p>
                  <p className={style.total}>
                    {cartData ? (
                      <span>
                        Total:{" "}
                        <span className={style.Pricespan}>
                          {(cartData.total / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}{" "}
                          DZD
                        </span>{" "}
                      </span>
                    ) : null}
                  </p>
                  <hr className={style.hr} />
                  <h2 className={style.payemntM}>Payment Method</h2>
                  <form>
                    <div className={style.formGroup}>
                      <select
                        className={style.methode}
                        id="paymentMethod"
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handlePaymentChange}
                      >
                        <option value="COD">Cash On Delivery</option>
                        <option value="EDAHABIA">EDAHABIA/CIB</option>
                      </select>
                    </div>
                    <button
                      className={style.btnm}
                      onClick={
                        paymentMethod === "COD"
                          ? submitPayment
                          : submitPaymentForm
                      }
                    >
                      {paymentMethod === "COD"
                        ? "Proceed Orders"
                        : "Proceed Secure Payment"}
                    </button>
                    {!message ? null : (
                      <h1 className={style.succempty}>{message}</h1>
                    )}
                    {!errmessage ? null : (
                      <h1 className={style.ERRempty}>{errmessage}</h1>
                    )}
                  </form>{" "}
                </div>
              </div>
            ) : (
              <div className={style.flexx}>
                <Image
                  src={banner}
                  className={style.banner}
                  style={{ marginTop: "20px" }}
                  width={550}
                  height={215}
                  alt="banner"
                />
                <h5 className={style.productss}>Saved Shipping Addresses</h5>
                <ul>
                  <li className={style.list}>
                    {storedSelectedAddress.first_name}{" "}
                    {storedSelectedAddress.last_name},{" "}
                    {storedSelectedAddress.address_1},{" "}
                    {storedSelectedAddress.city}
                  </li>
                  <div className={style.formGroup}>
                    <select
                      className={style.inputs}
                      id="shippingOption"
                      name="shippingOption"
                      onChange={updateOrderWithShippingOption}
                    >
                      <option value="">Select Shipping Option</option>
                      {shippingOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className={style.productss}>Products</p>
                    {cartData && cartData.items.length > 0
                      ? cartData.items.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            <div>
                              <section>
                                <h4 className={style.Pnamee}>
                                  {item.title}{" "}
                                  <span className={style.Pricespan}>
                                    {item.quantity}X
                                    {(
                                      item.subtotal /
                                      100 /
                                      item.quantity
                                    ).toLocaleString("en-US", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                    })}{" "}
                                    DZD
                                  </span>
                                </h4>
                              </section>
                            </div>
                          </div>
                        ))
                      : null}
                    <p className={style.totall}>
                      {cartData ? (
                        <span>
                          SubTotal:{" "}
                          <span style={{ color: "#520000" }}>
                            {(cartData.subtotal / 100).toLocaleString("en-US", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}{" "}
                            DZD
                          </span>
                        </span>
                      ) : null}
                    </p>
                    <p className={style.totall}>
                      {cartData ? (
                        <span>
                          {" "}
                          TaxTotal:{" "}
                          <span style={{ color: "#520000" }}>
                            {(cartData.tax_total / 100).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )}{" "}
                            DZD
                          </span>
                        </span>
                      ) : null}
                    </p>
                    <p className={style.totall}>
                      {cartData ? (
                        <span>
                          Total:{" "}
                          <span className={style.Pricespan}>
                            {(cartData.total / 100).toLocaleString("en-US", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}{" "}
                            DZD
                          </span>{" "}
                        </span>
                      ) : null}
                    </p>
                    <hr className={style.hrr} />
                    <h2 className={style.payemntMM}>Payment Method</h2>
                    <form>
                      <div className={style.formGroup}>
                        <select
                          className={style.methodee}
                          id="paymentMethod"
                          name="paymentMethod"
                          value={paymentMethod}
                          onChange={handlePaymentChange}
                        >
                          <option value="COD">Cash On Delivery</option>
                          <option value="EDAHABIA">Payment Online </option>{" "}
                        </select>
                      </div>
                      <button
                        className={style.btnmm}
                        onClick={
                          paymentMethod === "COD"
                            ? submitPaymentSaved
                            : submitPaymentFormSaved
                        }
                      >
                        {paymentMethod === "COD"
                          ? "Proceed Orders"
                          : "Proceed Secure Payment"}
                      </button>
                      {!message ? null : (
                        <h1 className={style.sasuccempty}>{message}</h1>
                      )}
                      {!errmessage ? null : (
                        <h1 className={style.saERRempty}>{errmessage}</h1>
                      )}
                    </form>{" "}
                  </div>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className={style.card}>
          {session ? (
            cartData ? (
              <div>
                {cartData.customer_id === session.id ? (
                  <div className={style}>
                    {cartData.items.length > 0 ? (
                      cartData.items.map((item, itemIndex) => (
                        <div className={style.CartItem} key={itemIndex}>
                          <div>
                            <section>
                              <Image
                                src={item.thumbnail}
                                width={180}
                                height={200}
                                alt=""
                              />
                              <h6 className={style.carttitle}>{item.title}</h6>
                              <h6 className={style.cartVariant}>
                                {item.description}
                              </h6>
                              <h6 className={style.QtyPrice}>
                                {item.quantity} X{" "}
                                <span>
                                  {(
                                    item.subtotal /
                                    100 /
                                    item.quantity
                                  ).toLocaleString("en-US", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  })}
                                </span>{" "}
                                DZA
                              </h6>
                            </section>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={style.empty}>No items in this cart</p>
                    )}
                  </div>
                ) : (
                  <p className={style.empty}>Your cart is empty.</p>
                )}
              </div>
            ) : (
              <p className={style.empty}>No Data Found.</p>
            )
          ) : (
            <p className={style.empty}>Sign in to view your cart.</p>
          )}
        </div>
      </main>
      <ButtomHeader />
    </div>
  );
}
