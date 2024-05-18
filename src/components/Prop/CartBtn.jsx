import style from "../NavBar/page.module.css";
import Link from "next/link";

export default function CartBtn() {
  let cartData =
    typeof localStorage !== "undefined" &&
    JSON.parse(localStorage.getItem("cart_data"));
  return (
    <>
      {cartData && cartData.items.length > 0 ? (
        <Link className={style.cartLink} href="/Checkout">
          <button className={style.btn}>Proceed to Checkout</button>
        </Link>
      ) : (
        <button className={style.bto}>Adde Items First !!!</button>
      )}
    </>
  );
}
