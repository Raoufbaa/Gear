import style from "./page.module.css";
import SingleProductPage from "@/components/SingleProductPage/SingleProductPage";

export default function Page({ params }) {
  return (
    <div style={{ background: "var(--backgroundLinearGradiant)" }}>
      <SingleProductPage params={params} />
    </div>
  );
}
