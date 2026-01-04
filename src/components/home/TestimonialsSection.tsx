"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael R.",
    service: "Remote Start Installation",
    text: "Best decision ever! They came to my office parking lot in Aurora and installed a remote start while I worked. Done in 2 hours and beat the dealer's price by $200."
  },
  {
    name: "Sarah K.",
    service: "Marine Audio System",
    text: "Finally found someone who does marine electronics! They came to my dock at Chatfield and installed a new stereo system. Professional, affordable, and convenient."
  },
  {
    name: "Jennifer L.",
    service: "Backup Camera Upgrade",
    text: "As a mom in Highlands Ranch, I couldn't be without my car for days. MAP Mobile came to my house during naptime and installed a backup camera. So convenient!"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary mb-4">Social Proof</h2>
        <h3 className="text-4xl md:text-6xl font-black uppercase italic">What Our Customers Say</h3>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((item, idx) => (
          <motion.div 
            key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-10 rounded-[2.5rem] text-left border border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex text-primary mb-6 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              </div>
              <p className="italic text-lg text-foreground/80 font-medium leading-relaxed mb-8">
                "{item.text}"
              </p>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary italic">
                {item.name[0]}
              </div>
              <div>
                <div className="font-black uppercase italic tracking-tight">{item.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-primary font-black">{item.service}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
