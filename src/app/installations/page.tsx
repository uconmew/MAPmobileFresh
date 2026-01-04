"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Tag, CheckCircle2, Music, Shield, Zap, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function InstallationsPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase.from("services").select("*").order("base_price", { ascending: true });
      if (!error && data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  const categories = ["ALL", ...new Set(services.map(s => s.category))];
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredServices = activeCategory === "ALL" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Deployment Hub</h1>
        <h2 className="mt-2 text-5xl font-black tracking-tighter sm:text-6xl uppercase italic">
          Professional <span className="text-primary">Installations</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60 font-medium">
          Expert car audio, security, and electronics installations brought directly to your location. Premium components, elite craftsmanship.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest transition-all ${
              activeCategory === cat 
                ? 'blue-gradient border-none shadow-lg shadow-primary/20' 
                : 'border-white/10 hover:bg-white/5 text-foreground/40'
            }`}
          >
            {cat.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-80 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
          ))
        ) : (
          filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 md:flex-row group hover:border-primary/40 transition-colors"
            >
              <div className="relative h-64 w-full md:h-auto md:w-2/5 overflow-hidden">
                <Image
                  src={service.image_url || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f"}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest border border-primary/30 text-white">
                    {service.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8 bg-black/40">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{service.name}</h3>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed font-medium mb-6">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest">Est. Time</p>
                      <p className="text-xs font-bold">{service.estimated_time} MINS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase text-foreground/30 tracking-widest">Base Rate</p>
                      <p className="text-xs font-bold">${Number(service.base_price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button asChild className="w-full blue-gradient text-white border-none h-14 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-primary/20 group">
                    <Link href={`/book?serviceId=${service.id}`} className="flex items-center justify-center gap-2">
                      Initialize Booking
                      <Wrench className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Comparison or Add-ons Section */}
      <section className="mt-32 rounded-[3rem] bg-white/5 p-12 md:p-16 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <h3 className="text-4xl font-black text-center mb-16 uppercase italic tracking-tighter">THE <span className="text-primary">MAP MOBILE</span> ADVANTAGE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {[
            { title: "Lifetime Warranty", desc: "Our craftsmanship is guaranteed for as long as you own your vehicle.", icon: Shield },
            { title: "Certified Expertise", desc: "MECP certified technicians with years of complex integration experience.", icon: CheckCircle2 },
            { title: "Mobile Deployment", desc: "Zero downtime for you. We deploy to your home, office, or job site.", icon: Zap },
            { title: "Precision Tools", desc: "We utilize oscilloscope-tuned audio and factory-grade diagnostic tools.", icon: Wrench },
            { title: "Full Liability Shield", desc: "Comprehensive insurance coverage for total peace of mind during service.", icon: Shield },
            { title: "Expert Engineering", desc: "Customized solutions designed specifically for your vehicle's architecture.", icon: Zap }
          ].map((feature, i) => (
            <div key={feature.title} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-black text-lg uppercase italic tracking-tighter">{feature.title}</span>
              </div>
              <p className="text-foreground/50 text-sm leading-relaxed font-medium pl-16">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
