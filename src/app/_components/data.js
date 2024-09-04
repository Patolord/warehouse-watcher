import { BarChart2, Clock, Shield, Smartphone, Zap, Database } from "lucide-react";
import benefitOneImg from "../../../public/img/benefit-one.png";
import benefitTwoImg from "../../../public/img/benefit-two.png";

const benefitOne = {
  title: "Real-Time Inventory Management",
  desc: "Warehouse Watcher provides instant visibility into your inventory, helping you make informed decisions faster and more accurately than ever before.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Live Stock Updates",
      desc: "See stock levels change in real-time as items move in and out of your warehouse.",
      icon: <Clock />
    },
    {
      title: "Advanced Analytics",
      desc: "Gain insights into inventory trends, predict future needs, and optimize your stock levels.",
      icon: <BarChart2 />
    },
    {
      title: "Streamlined Operations",
      desc: "Automate routine tasks and reduce manual errors, boosting overall efficiency.",
      icon: <Zap />
    },
  ],
};

const benefitTwo = {
  title: "User-Centric Design",
  desc: "Warehouse Watcher is built with both businesses and customers in mind, offering an intuitive interface that makes inventory management a breeze.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Mobile-First Approach",
      desc: "Access your inventory data anytime, anywhere with our responsive mobile design.",
      icon: <Smartphone />
    },
    {
      title: "Standalone Solution",
      desc: "No complex integrations required. Warehouse Watcher works right out of the box.",
      icon: <Database />
    },
    {
      title: "Secure and Reliable",
      desc: "Built on Convex DB for unparalleled data security and system reliability.",
      icon: <Shield />
    },
  ],
};

export {benefitOne, benefitTwo};