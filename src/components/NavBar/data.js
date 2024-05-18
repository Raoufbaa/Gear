import { AiOutlineHeart } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { CiShop } from "react-icons/ci";
import { IoHelpCircleOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";

export const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
    img: <IoHomeOutline />,
  },
  {
    id: 2,
    title: "Shop",
    url: "/Shop",
    img: <CiShop />,
  },
  {
    id: 3,
    title: "Contact",
    url: "/Contact",
    img: <IoHelpCircleOutline />,
  },
  {
    id: 4,
    title: "About",
    url: "/About",
    img: <IoMdInformationCircleOutline />,
  },
];
