"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";

export default function PriceMatchSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="blue-gradient rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl shadow-primary/30">
        <div className="flex-1 space-y-8 z-10">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/70 mb-4">Value Proposition</h2>
            <h3 className="text-4xl md:text-7xl font-black uppercase italic text-white leading-[0.9]">Our Price Match Promise</h3>
          </div>
          <p className="text-xl text-white/80 font-medium leading-relaxed max-w-2xl">
            We believe in fair, honest pricing. As a local Denver mobile business, we don't have the overhead costs of expensive storefronts, so we can beat traditional shop prices.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Match or beat Denver shops",
              "Same quality installation",
              "No hidden fees or surprises",
              "Transparent pricing, every time"
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-white">
                <CheckCircle2 className="h-5 w-5 text-white/50" />
                <span className="font-bold uppercase text-xs tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3 w-full space-y-6 z-10">
          <div className="glass-card p-8 rounded-3xl bg-white/10 border-white/20 backdrop-blur-xl">
            <h4 className="text-xl font-black uppercase italic text-white mb-6">Why We're Cheaper:</h4>
            <ul className="space-y-4 text-white/80 font-bold text-sm uppercase tracking-widest">
              <li className="flex items-center gap-3"><Zap className="h-4 w-4" /> No retail storefront</li>
              <li className="flex items-center gap-3"><Zap className="h-4 w-4" /> Lower overhead costs</li>
              <li className="flex items-center gap-3"><Zap className="h-4 w-4" /> Direct supplier relationships</li>
              <li className="flex items-center gap-3"><Zap className="h-4 w-4" /> Efficient mobile operations</li>
            </ul>
          </div>
          <Button asChild size="lg" className="w-full bg-white text-primary hover:bg-white/90 h-16 text-xl font-black uppercase tracking-widest rounded-2xl">
            <Link href="/book">Get Your Quote Today</Link>
          </Button>
        </div>
        
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
