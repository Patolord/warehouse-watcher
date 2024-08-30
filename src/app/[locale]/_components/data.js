import { BarChart2, Clock, Shield, Smartphone, Zap, Database } from "lucide-react";
import benefitOneImg from "../../../../public/img/benefit-one.png";
import benefitTwoImg from "../../../../public/img/benefit-two.png";

const benefitOne = {
  titleKey: "benefitOne.title",
  descKey: "benefitOne.desc",
  image: benefitOneImg,
  bullets: [
    {
      titleKey: "benefitOne.bullets.liveStockUpdates.title",
      descKey: "benefitOne.bullets.liveStockUpdates.desc",
      icon: <Clock />
    },
    {
      titleKey: "benefitOne.bullets.advancedAnalytics.title",
      descKey: "benefitOne.bullets.advancedAnalytics.desc",
      icon: <BarChart2 />
    },
    {
      titleKey: "benefitOne.bullets.streamlinedOperations.title",
      descKey: "benefitOne.bullets.streamlinedOperations.desc",
      icon: <Zap />
    },
  ],
};

const benefitTwo = {
  titleKey: "benefitTwo.title",
  descKey: "benefitTwo.desc",
  image: benefitTwoImg,
  bullets: [
    {
      titleKey: "benefitTwo.bullets.mobileFirst.title",
      descKey: "benefitTwo.bullets.mobileFirst.desc",
      icon: <Smartphone />
    },
    {
      titleKey: "benefitTwo.bullets.standalone.title",
      descKey: "benefitTwo.bullets.standalone.desc",
      icon: <Database />
    },
    {
      titleKey: "benefitTwo.bullets.secure.title",
      descKey: "benefitTwo.bullets.secure.desc",
      icon: <Shield />
    },
  ],
};

export {benefitOne, benefitTwo};