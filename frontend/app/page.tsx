"use client";

import { useState } from "react";

// ── Import from app/components/ ──
// (components folder is inside your app/ folder)
import Navbar       from "@/app/components/Navbar";
import Hero         from "@/app/components/Hero";
import Stats        from "@/app/components/Stats";
import SmartFarming from "@/app/components/SmartFarming";
import Nutrition    from "@/app/components/Nutrition";
import Marketplace  from "@/app/components/Marketplace";
import Footer       from "@/app/components/Footer";
import Modal        from "@/app/components/Modal";

export default function AgriAIPage() {
  const [modal, setModal] = useState<"farmer" | "consumer" | null>(null);

  const openFarmer   = () => setModal("farmer");
  const openConsumer = () => setModal("consumer");
  const closeModal   = () => setModal(null);

  return (
    <>
      <Navbar       onGetStarted={openFarmer} />
      <Hero         onFarmer={openFarmer}  onConsumer={openConsumer} />
      <Stats />
      <SmartFarming />
      <Nutrition />
      <Marketplace />
      <Footer       onFarmer={openFarmer}  onConsumer={openConsumer} />
      {modal && <Modal role={modal} onClose={closeModal} />}
    </>
  );
}