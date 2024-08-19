import { Container } from "@/app/_components/Container";
import { Hero } from "@/app/_components/Hero";
import { SectionTitle } from "@/app/_components/SectionTitle";
import { Benefits } from "@/app/_components/Benefits";
import { Faq } from "@/app/_components/Faq";

import { benefitOne, benefitTwo } from "@/app/_components/data";
import { SignIn } from "@/app/auth/SignIn";


export default function Home() {
  return (
    <Container>
      <Hero />
      <SignIn />
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="See It in Action"
        title="Discover the Power of Real-Time Inventory Management"
      >
        Watch how Warehouse Watcher transforms your inventory process. With its
        intuitive interface and real-time updates, youll wonder how you ever
        managed without it. See why our users are calling it a game-changer in
        warehouse management.
      </SectionTitle>


      <SectionTitle preTitle="FAQ" title="Common Questions About Warehouse Watcher">
        Get answers to frequently asked questions about Warehouse Watcher.
        Learn more about its features, how it works without integration, and
        how it can be customized for your specific needs.
      </SectionTitle>

      <SectionTitle
        preTitle="Warehouse Watcher Benefits"
        title="Why Warehouse Watcher is Your Best Inventory Solution"
      >
        Warehouse Watcher is a cutting-edge, real-time warehouse and inventory system.
        Built with a clean UI and user-friendly design, it caters to both businesses
        and customers. As an anti-ERP solution, it requires no integration with other
        software, making it a standalone powerhouse for inventory management.
      </SectionTitle>

      <Faq />

    </Container>
  );
}