"use client";
import { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const Context = createContext(null);

export default function GlobalState({ children }) {
  const { data: session } = useSession();
  const [wishlistItem, setWishlistItem] = useState([]); // Rename to wishlistItem
  const [Cid, setCid] = useState(null);
  const [cartEffect, setCartEffect] = useState(0);
  const [cartDataReset, setCartDataReset] = useState(0);
  const [addShippingRefresh, setAddShippingRefresh] = useState(0);
  const [cartData, setCartData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingTimer, setLoadingTimer] = useState(true);
  const [categoryMenu, setCategoryMenu] = useState(false);

  const [isItDark, setisItDark] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("isItDark") === "true"
  );

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("isItDark", isItDark);
    }
  }, [isItDark]);

  // Check if the user is authenticated
  if (session) {
    const userId = session.id;
    // console.log("SESSION: ", session);
  } else {
    // console.log("Session is undefined. The user is not authenticated.");
    // Handle the case where the user is not authenticated, e.g., redirect to a login page or show an error message.
  }

  // Construct the wishlist key if the user is authenticated
  const wishlistKey = session ? `wishlistItems_${session.id}` : null; // Rename to wishlistKey

  function removeWishlistItem(getCurrentId) {
    if (!wishlistKey) return; // No user means no wishlist

    console.log("Removing item with ID: ", getCurrentId);
    let cpyWishlistItems = [...wishlistItem];
    cpyWishlistItems = cpyWishlistItems.filter(
      (item) => item.id !== getCurrentId
    );
    setWishlistItem(cpyWishlistItems);
    localStorage.setItem(wishlistKey, JSON.stringify(cpyWishlistItems));
  }

  function handleAddToWishlist(getCurrentItem) {
    if (!wishlistKey) return; // No user means no wishlist

    let cpyWishlistItems = [...wishlistItem];
    const indexOfCurrentWishlistItem = cpyWishlistItems.findIndex(
      (item) => item.id === getCurrentItem.id
    );
    console.log("Adding item to wishlist: ", getCurrentItem.id);
    if (indexOfCurrentWishlistItem === -1) {
      cpyWishlistItems.push(getCurrentItem);
    }
    setWishlistItem(cpyWishlistItems);
    localStorage.setItem(wishlistKey, JSON.stringify(cpyWishlistItems));
  }

  useEffect(() => {
    if (!wishlistKey) return; // No user means no wishlist

    // Retrieve the user's wishlist data from local storage
    const storedWishlistData = JSON.parse(localStorage.getItem(wishlistKey));
    if (Array.isArray(storedWishlistData)) {
      setWishlistItem(storedWishlistData);
    } else {
      // Handle invalid or missing wishlist data
    }
  }, [wishlistKey]);

  return (
    <Context.Provider
      value={{
        wishlistItem,
        handleAddToWishlist,
        removeWishlistItem,
        Cid,
        setCid,
        setCartEffect,
        cartEffect,
        addShippingRefresh,
        setAddShippingRefresh,
        cartData,
        setCartData,
        cartDataReset,
        setCartDataReset,
        isItDark,
        setisItDark,
        selectedAddress,
        setSelectedAddress,
        loadingTimer,
        setLoadingTimer,
        categoryMenu,
        setCategoryMenu,
      }}
    >
      {children}
    </Context.Provider>
  );
}
