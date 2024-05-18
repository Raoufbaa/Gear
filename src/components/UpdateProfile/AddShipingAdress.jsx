"use client";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context";
import { useSession } from "next-auth/react";
import style from "./page.module.css";

export default function AddShippingAddress() {
  const { data: session } = useSession();
  const { addShippingRefresh, setAddShippingRefresh } = useContext(Context);

  const [formData, setFormData] = useState({
    address: {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      country_code: "dz",
      postal_code: "",
      phone: "",
      company: "",
      province: "",
    },
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (session) {
      const jwtToken = session.accessToken;
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/store/customers/me/addresses`;

      // Create the request headers with the JWT token
      const headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      });

      // Create the request options
      const requestOptions = {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      };

      // Send the POST request
      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request failed");
          }
          return response.json(); // Parse the response JSON if needed
        })
        .then((data) => {
          // Handle the successful response data here
          console.log("Address added successfully:", data);
          setAddShippingRefresh((prev) => prev + 1);
          console.log("changed", addShippingRefresh);
          // Optionally, reset the form fields after successful submission
          setFormData({
            address: {
              first_name: "",
              last_name: "",
              address_1: "",
              address_2: "",
              city: "",
              country_code: "dz",
              postal_code: "",
              phone: "",
              company: "",
              province: "",
            },
          });
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error adding address:", error);
        });
    }
  };
  useEffect(() => {
    if (session) {
      setFormData({
        address: {
          first_name: session.name || "",
          last_name: session.Last_name || "",
          address_1: "",
          address_2: "",
          city: "",
          country_code: "dz",
          postal_code: "",
          phone: session.phone || "",
          company: "",
          province: "",
        },
      });
    }
  }, [session]);
  // console.log("data", formData);

  return (
    <div>
      <h1 className={style.title}>Add Shipping Address</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className={style.input}
            type="text"
            id="first_name"
            name="first_name"
            placeholder="First Name"
            value={formData.address.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            value={formData.address.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="address_1"
            name="address_1"
            placeholder="Address Line 1"
            value={formData.address.address_1}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="address_2"
            name="address_2"
            placeholder="Address Line 2"
            value={formData.address.address_2}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="city"
            name="city"
            placeholder="City"
            value={formData.address.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className={style.input}
            type="hidden"
            id="country_code"
            name="country_code"
            value={formData.address.country_code}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="postal_code"
            name="postal_code"
            placeholder="Postal Code"
            value={formData.address.postal_code}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="phone"
            name="phone"
            placeholder="Phone (Optional)"
            value={formData.address.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="company"
            name="company"
            placeholder="Company (Optional)"
            value={formData.address.company}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            id="province"
            name="province"
            placeholder="Province (Optional)"
            value={formData.address.province}
            onChange={handleInputChange}
          />
        </div>
        <button className={style.btn} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
