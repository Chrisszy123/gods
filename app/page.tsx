// app/page.tsx
// Mobile-first, brand-accurate Next.js landing page for "Gods of the Stage"
// Fonts: Cogs & Bolts (primary), Nexa (secondary) via next/font/local
// Visuals: Logo placement + subtle 3D motion
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import localFont from "next/font/local";
import dynamic from "next/dynamic";

// Dynamically import PaymentModal with SSR disabled to avoid window issues
const PaymentModal = dynamic(() => import("@/components/PaymentModal"), {
  ssr: false,
});


// === BRAND FONTS ===
// Place font files in /public/fonts/
const cogsBolts = localFont({
src: "./fonts/cogs_and_bolts/cogs_and_bolts.ttf",
variable: "--font-cogs",
display: "swap",
});


const nexa = localFont({
src: [
{ path: "./fonts/nexa/Nexa-ExtraLight.ttf", weight: "400", style: "normal" },
{ path: "./fonts/nexa/Nexa-Heavy.ttf", weight: "700", style: "normal" },
],
variable: "--font-nexa",
display: "swap",
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <main
      className={`${cogsBolts.variable} ${nexa.variable} min-h-screen bg-black text-white overflow-hidden font-[var(--font-nexa)]`}
    >
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        {/* Animated stage lights */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_top,#febf53,transparent_60%)] animate-pulse opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#d5421e]/40 via-black to-black" />
        </div>

        {/* Background performance image */}
        <img
          src="/gods.jpeg"
          alt="Gods of the Stage Background"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />

        {/* Floating 3D Logo */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, rotateY: -20, y: -40 }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          whileHover={{ rotateX: 15, rotateY: 15, scale: 1.05 }}
          className="absolute top-6 left-6 z-20"
          style={{ perspective: 1200 }}
        >
          <Image
            src="/gods.png"
            alt="Gods of the Stage Logo"
            width={72}
            height={72}
            className="drop-shadow-[0_15px_40px_rgba(254,191,83,0.45)]"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 max-w-4xl px-6 text-center"
        >
          <motion.h1
            initial={{ letterSpacing: "0.2em" }}
            animate={{ letterSpacing: "0.02em" }}
            transition={{ duration: 1 }}
            className={`${cogsBolts.className} text-4xl sm:text-6xl md:text-7xl font-extrabold`}
          >
            Gods of the Stage
          </motion.h1>

          <p className={`${nexa.className} mt-6 text-base sm:text-lg md:text-xl text-gray-200`}>
            Win <span className="text-[#febf53] font-bold">₦5,000,000</span> and claim the <span className="text-[#febf53] font-bold">god title</span>. This isn't a competition—it's a coronation.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
            <button
              onClick={handleOpenModal}
              className="rounded-2xl bg-gradient-to-r from-[#febf53] to-[#d5421e] px-10 py-5 font-semibold text-black transition hover:scale-105 active:scale-95"
            >
              Audition Now
            </button>
            {/* <a
              href="#about"
              className={`${nexa.className} rounded-2xl border border-white/30 px-10 py-5 font-semibold backdrop-blur transition hover:bg-white hover:text-black`}
            >
              Watch the Journey
            </a> */}
          </div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 sm:px-6 py-20 max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`${cogsBolts.className} text-3xl sm:text-4xl font-bold mb-5`}>
              What is Gods of the Stage?
            </h2>
            <p className={`${nexa.className} text-gray-300 leading-relaxed`}>
              Gods of the Stage is a premium talent hunt built to discover
              performers with presence, passion, and originality. More than a
              competition — it’s a launchpad for iconic stage careers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-[#febf53] to-[#d5421e] p-[1px]"
          >
            <div className="rounded-3xl bg-black p-6 sm:p-8">
              <ul className={`${nexa.className} space-y-3 text-gray-200`}>
                <li>🎤 Musician</li>
                <li>💃 Dancers</li>
                <li>🎭 Creative Arts</li>
                <li>😆 Comedy</li>
                <li>🗣️ Spoken Word & Poetry</li>
                <li>🤝Special Skills /others</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white text-black py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${cogsBolts.className} text-3xl sm:text-4xl font-bold text-center mb-14`}>
            How It Works
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {["Apply", "Audition", "Dominate"].map((title, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm"
              >
                <h3 className={`${nexa.className} text-xl sm:text-2xl font-semibold mb-3`}>
                  {title}
                </h3>
                <p className={`${nexa.className} text-gray-700`}>
                  {title === "Apply" &&
                    "Submit your entry and showcase your talent."}
                  {title === "Audition" &&
                    "Selected talents perform before our judges."}
                  {title === "Dominate" &&
                    "Own the stage and rise as a God of performance."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="apply" className="px-4 sm:px-6 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className={`${cogsBolts.className} text-3xl sm:text-5xl font-bold mb-5`}>
            The Stage Is Calling
          </h2>
          <p className={`${nexa.className} text-gray-300 mb-8`}>
            Thousands will watch. Few will rise. Will you answer?
          </p>
          <button
            onClick={handleOpenModal}
            className={`${nexa.className} inline-block rounded-2xl bg-gradient-to-r from-[#febf53] to-[#d5421e] px-12 py-5 font-semibold text-black transition active:scale-95 hover:scale-105`}
          >
            Apply Now
          </button>
          
          {/* Powered by Nombrz */}
          <div className="mt-6 flex items-center justify-center gap-2 opacity-70">
            <span className={`${nexa.className} text-xs text-gray-400`}>Powered by</span>
            <img 
              src="/nombrz.png" 
              alt="Nombrz" 
              className="h-4 object-contain"
            />
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className={`${nexa.className} border-t border-white/10 py-6 text-center text-gray-400 text-xs sm:text-sm`}>
        © {new Date().getFullYear()} Gods of the Stage. All rights reserved.
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        publicKey={publicKey}
      />
    </main>
  );
}
