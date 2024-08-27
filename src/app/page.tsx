import { Container } from "@/app/_components/Container";
import { Hero } from "@/app/_components/Hero";
import { SectionTitle } from "@/app/_components/SectionTitle";
import { Benefits } from "@/app/_components/Benefits";
import { Faq } from "@/app/_components/Faq";

import { benefitOne, benefitTwo } from "@/app/_components/data";




export default function Home() {
  return (
    <Container>
      <Hero />

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />


    </Container>
  );
}