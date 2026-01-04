"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Clock, Award, Shield, Zap } from "lucide-react";

const benefits = [
  {
    title: "We Come To You",
    desc: "From Downtown Denver to Castle Rock, we install at your home, office, or anywhere you need us.",
    icon: <MapPin className="h-8 w-8" />
  },
  {
    title: "Denver Price Match",
    desc: "Found a lower price in the metro? We'll match it. Local business, lower overhead, better value.",
    icon: <DollarSign className="h-8 w-8" />
  },
  {
    title: "Same-Day Service",
    desc: "Most installations completed in 2-4 hours. Fast, reliable service that respects your schedule.",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Professional Quality",
    desc: "Our experienced team delivers clean, professional installations with proper wiring and precision.",
    icon: <Award className="h-8 w-8" />
  },
  {
    title: "Local & Trusted",
    desc: "We're your Denver neighbors. Invested in our community and building lasting relationships.",
    icon: <Shield className="h-8 w-8" />
  },
  {
    title: "Complete Tech",
    desc: "From high-end audio to complex security, we handle all automotive and marine electronics.",
    icon: <Zap className="h-8 w-8" />
  }
];

export default function BenefitsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary mb-4">The MAP Advantage</h2>
        <h3 className="text-4xl md:text-6xl font-black uppercase italic">Why Choose MAP Mobile?</h3>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {benefits.map((benefit, idx) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-10 rounded-3xl border border-white/5 group hover:border-primary/30 transition-all"
          >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              {benefit.icon}
            </div>
            <h4 className="text-2xl font-black mb-4 uppercase italic">{benefit.title}</h4>
            <p className="text-foreground/60 leading-relaxed font-medium">{benefit.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
