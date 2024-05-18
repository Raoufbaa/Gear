import style from "./page.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";

export default function ProductSlider({ products = [] }) {
  const NextArrow = ({ onClick }) => (
    <button className="slick-arrow slick-next" onClick={onClick}>
      Next
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="slick-arrow slick-prev" onClick={onClick}>
      Prev
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Slider {...settings}>
      {products.map((product) => (
        <div className={style.MainContainer} key={product.id}>
          <div className={style.ProductContainer}>
            <Link href={`/Shop/${product.id}`} className={style.ImageContainer}>
              <Image
                className={style.Pimg}
                src={product.thumbnail}
                width={250}
                height={310}
                alt={product.title}
              />
            </Link>
            <div className={style.TextContainer}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}
