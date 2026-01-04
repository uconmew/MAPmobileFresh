"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Smartphone, HelpCircle } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 text-center">
      <div className="blue-gradient p-16 lg:p-24 rounded-[4rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <h2 className="text-5xl lg:text-8xl font-black tracking-tight uppercase italic leading-none z-10 relative">
          UPGRADE YOUR <br /> DRIVE TODAY
        </h2>
        <p className="mt-8 text-white/70 text-xl font-medium max-w-2xl mx-auto z-10 relative">
          Professional mobile installation is just a few clicks away. We're ready to bring the shop to your Denver door.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row z-10 relative">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-16 px-16 text-xl font-black uppercase tracking-widest rounded-2xl shadow-xl">
            <Link href="/book">Book Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 border-white/30 bg-white/10 px-16 text-xl font-black uppercase tracking-widest backdrop-blur-md hover:bg-white/20 rounded-2xl">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-8 text-white/50 font-black uppercase tracking-[0.3em] text-[10px] z-10 relative">
          <span className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> TEXT FOR QUOTE</span>
          <span className="hidden sm:block">•</span>
          <span className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> 24/7 SUPPORT</span>
        </div>
      </div>
    </section>
  );
}
