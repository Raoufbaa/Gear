import style from "./page.module.css";
import { TbCpu2 } from "react-icons/tb";
import {
  BsDeviceHdd,
  BsMouse,
  BsPrinter,
  BsUsbDrive,
  BsRouter,
  BsMotherboard,
  BsCamera,
  BsGrid,
} from "react-icons/bs";
import { PiDesktopTowerLight } from "react-icons/pi";
import { RxLaptop } from "react-icons/rx";
import { RiMic2Line } from "react-icons/ri";

export const categories = [
  {
    name: "Core Component",
    icon: <TbCpu2 className={style.ico} />,
    submenu: [
      "CPUs/Processor",
      "GPU",
      "Motherboard",
      "Computer Case",
      "Fans & PC Cooling",
      "RAM",
      "Power Supply",
    ],
  },
  {
    name: "Storage Device",
    icon: <BsDeviceHdd className={style.ico} />,
    submenu: ["HDD", "SSD", "External HDD", "External SSD", "USB Drive"],
  },
  {
    name: "Peripherals",
    icon: <BsMouse className={style.ico} />,
    submenu: ["Mouse", "Keyboard", "Monitor", "Headset", "Webcam"],
  },
  {
    name: "Desktops / PCs",
    icon: <PiDesktopTowerLight className={style.ico} />,
    submenu: [
      "Gaming Desktop",
      "Desktop Computer",
      "All-In-One-Computer",
      "Gaming Console",
      "Chrombook & Mini PCs",
    ],
  },
  {
    name: "Laptops / Notebooks",
    icon: <RxLaptop className={style.ico} />,
    submenu: [
      "Gaming Laptop",
      "Business Laptop",
      "2-in-1 Laptops",
      "Chromebooks",
      "Ultraportable Laptops",
    ],
  },
  {
    name: "Printer / Scanner & Supplies",
    icon: <BsPrinter className={style.ico} />,
    submenu: [
      "Printers",
      "Scanners",
      "Printer Ink & Toner",
      "Printer Paper",
      "Printer Accessories",
    ],
  },
  {
    name: "Accessories",
    icon: <BsUsbDrive className={style.ico} />,
    submenu: [
      "Cables & Adapters",
      "Phone Accessories",
      "Tablet Accessories",
      "Laptop Accessories",
      "Computer Components",
    ],
  },
  {
    name: "Networking",
    icon: <BsRouter className={style.ico} />,
    submenu: [
      "Routers",
      "Modems",
      "Network Switches",
      "Wireless Access Points",
      "Powerline Network Adapters",
    ],
  },
  {
    name: "Electronics & Robotics",
    icon: <BsMotherboard className={style.ico} />,
    submenu: [
      "Drones",
      "Robot Kits",
      "Arduino Boards",
      "Electronic Components",
      "DIY Kits",
    ],
  },
  {
    name: "Camera & Accessories",
    icon: <BsCamera className={style.ico} />,
    submenu: [
      "Digital Cameras",
      "Action Cameras",
      "Camera Lenses",
      "Camera Accessories",
      "Photography Lighting",
    ],
  },
  {
    name: "Software & Services",
    icon: <BsGrid className={style.ico} />,
    submenu: [
      "Operating Systems",
      "Productivity Software",
      "Security Software",
      "Creative Software",
      "Subscription Services",
    ],
  },
  {
    name: "Office & Gaming Furniture",
    icon: <RiMic2Line className={style.ico} />,
    submenu: [
      "Office Chairs",
      "Desks & Workstations",
      "Gaming Chairs",
      "Gaming Desks",
      "Monitor Stands & Mounts",
    ],
  },
];
