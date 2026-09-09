import Hero from "@/components/Hero";
import ScrollSpine from "@/components/ScrollSpine";
import Proposition from "@/components/Proposition";
import Positioning from "@/components/Positioning";
import Offer from "@/components/Offer";
import Proof from "@/components/Proof";
import Founders from "@/components/Founders";
import Close from "@/components/Close";

/** All seven sections. S5 renders only when the CMS has something. */
export default function Page() {
  return (
    <>
      <ScrollSpine />
      <main>
        <Hero />
        <Proposition />
        <Positioning />
        <Offer />
        <Proof />
        <Founders />
        <Close />
      </main>
    </>
  );
}
