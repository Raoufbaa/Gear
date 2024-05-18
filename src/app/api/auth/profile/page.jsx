"use client";
import UpdateProfile from "@/components/UpdateProfile/UpdateProfile";
import style from "./page.module.css";
import AddShipingAdress from "@/components/UpdateProfile/AddShipingAdress";
import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import SavedShippingAdress from "@/components/UpdateProfile/SavedShippingAdress";

export default function Page() {
  const [isShipingAdress, setisShipingAdress] = useState(false);
  const [mobileInfo, setMobileInfo] = useState(false);

  const toggleShippingAdress = () => {
    setisShipingAdress((prev) => !prev);
  };
  useEffect(() => {
    window.innerWidth < 768 ? setMobileInfo(true) : setMobileInfo(false);
  }, [mobileInfo]);
  return (
    <div
      style={{ maxWidth: isShipingAdress ? "970px" : "460px" }}
      className={style.updateProfile}
    >
      <div>
        <UpdateProfile />
        {isShipingAdress ? <SavedShippingAdress /> : null}
      </div>
      <button className={style.btn} onClick={toggleShippingAdress}>
        {isShipingAdress && mobileInfo ? (
          <FaChevronUp />
        ) : !isShipingAdress && mobileInfo ? (
          <FaChevronDown />
        ) : isShipingAdress && !mobileInfo ? (
          <FaChevronLeft />
        ) : (
          <FaChevronRight />
        )}
      </button>
      {isShipingAdress ? <AddShipingAdress /> : null}
    </div>
  );
}
