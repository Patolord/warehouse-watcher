import Image from "next/image";
import heroImg from "../../../public/img/hero.png";
import {
  Clock,
  BarChart2,
  Shield,
  Database,
  LucideIcon,
  Layout,
} from "lucide-react";

import HeroAuth from "./HeroAuth";
import { Container } from "./Container";

export const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Warehouse Watcher: Your Inventory, Real-Time
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Warehouse Watcher is a powerful, user-friendly inventory system
              that brings real-time updates to your fingertips. Designed for
              both businesses and customers, it&apos;s the standalone solution
              that revolutionizes warehouse management.
            </p>
            <HeroAuth />
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col justify-center py-12">
          <div className="text-xl text-center text-gray-700 dark:text-white">
            Empowering your inventory management with{" "}
            <span className="text-indigo-600">cutting-edge features</span>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-10 sm:grid-cols-3 lg:grid-cols-5">
            <Feature icon={Clock} title="Realtime Updates" />
            <Feature icon={BarChart2} title="Advanced Reports" />
            <Feature icon={Shield} title="Auditable Data" />
            <Feature icon={Database} title="Standalone Solution" />
            <Feature icon={Layout} title="Clean, Polished UI" />
          </div>
        </div>
      </Container>
    </>
  );
};

interface FeatureIconProps {
  Icon: LucideIcon;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ Icon }) => (
  <div className="p-3 bg-indigo-100 rounded-full dark:bg-indigo-900">
    <Icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
  </div>
);

interface FeatureProps {
  icon: LucideIcon;
  title: string;
}

const Feature: React.FC<FeatureProps> = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center">
    <FeatureIcon Icon={Icon} />
    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
      {title}
    </h3>
  </div>
);
