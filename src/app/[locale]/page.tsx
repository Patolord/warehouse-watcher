import { benefitOne, benefitTwo } from "@/app/[locale]/_components/data";
import { Container } from "./_components/Container";
import { Hero } from "./_components/Hero";
import { Benefits } from "./_components/Benefits";

export default function Home() {
  return (
    <Container>
      <Hero />

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />


    </Container>
  );
}