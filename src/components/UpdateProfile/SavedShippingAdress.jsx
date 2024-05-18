"use client";
import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../context";
import style from "./page.module.css";
import { useSession } from "next-auth/react";
import { CiSquareRemove } from "react-icons/ci";

export default function SavedShippingAddress() {
  const { data: session } = useSession();
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const { addShippingRefresh, selectedAddress, setSelectedAddress } =
    useContext(Context);
  const isFirstRender = useRef(true);

  useEffect(() => {
    try {
      const storedSelectedAddress = localStorage.getItem("selectedAddress");
      if (storedSelectedAddress) {
        setSelectedAddress(JSON.parse(storedSelectedAddress));
      }
    } catch (error) {
      console.error("Error while retrieving from localStorage:", error);
    }
  }, [setSelectedAddress]);

  useEffect(() => {
    if (session) {
      const jwtToken = session.accessToken;
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/store/customers/me`;

      const headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      });

      fetch(apiUrl, { headers })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const newShippingAddresses = data.customer.shipping_addresses;
            setShippingAddresses(newShippingAddresses);

            if (newShippingAddresses.length === 1) {
              setSelectedAddress(newShippingAddresses[0]);
              localStorage.setItem(
                "selectedAddress",
                JSON.stringify(newShippingAddresses[0])
              );
            } else if (
              newShippingAddresses.length > 1 &&
              !isFirstRender.current
            ) {
              const defaultAddress = newShippingAddresses[0];
              setSelectedAddress(defaultAddress);
              localStorage.setItem(
                "selectedAddress",
                JSON.stringify(defaultAddress)
              );
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    isFirstRender.current = false;
  }, [session, addShippingRefresh, setSelectedAddress]);

  useEffect(() => {
    if (!session) {
      setSelectedAddress(null);
    } else {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    }
  }, [session, selectedAddress, setSelectedAddress]);

  const removeAddress = async (addressId) => {
    if (session) {
      const jwtToken = session.accessToken;
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/store/customers/me/addresses/${addressId}`;

      const headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
      });

      try {
        const response = await fetch(apiUrl, { method: "DELETE", headers });
        if (response.ok) {
          setShippingAddresses((prevAddresses) =>
            prevAddresses.filter((address) => address.id !== addressId)
          );
        } else {
          console.error("Failed to delete address.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Check if there's only one address left after deletion
    if (shippingAddresses.length === 1) {
      try {
        localStorage.removeItem("selectedAddress");
        setSelectedAddress(null);
      } catch (error) {
        console.error("Error while clearing localStorage:", error);
      }
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    try {
      localStorage.setItem("selectedAddress", JSON.stringify(address));
    } catch (error) {
      console.error("Error while storing in localStorage:", error);
    }
  };

  return (
    <div>
      <h5 className={style.subtitle}>Saved Shipping Addresses</h5>
      <ul>
        {shippingAddresses.map((address) => (
          <li
            className={`${style.list} ${
              selectedAddress === address ? style.selected : ""
            }`}
            key={address.id}
            onClick={() => handleSelectAddress(address)}
          >
            {address.first_name} {address.last_name}, {address.address_1},{" "}
            {address.city}
            <button
              className={style.deletebtn}
              onClick={() => removeAddress(address.id)}
            >
              <CiSquareRemove />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
