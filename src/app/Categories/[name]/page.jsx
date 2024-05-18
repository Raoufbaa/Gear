import Header from "@/components/Header/Header";
import style from "./page.module.css";
import CategoriesProduct from "@/components/Products/CategoriesProduct";
import ButtomHeader from "@/components/ButtomHeader/ButtomHeader";
import SProducts from "@/components/Products/SProducts";

export default function Page({ params }) {
  return (
    <div>
      <Header />
      <CategoriesProduct params={params} />
      <SProducts name={"Our Other Products"} />
      <ButtomHeader />
    </div>
  );
}
