"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function LocationSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1557404763-69708cd8b9ce?q=75&w=800&auto=format&fit=crop"
            alt="Denver Metro Service Area"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="glass-card p-12 rounded-[2rem] border-white/20 text-center backdrop-blur-3xl">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
              <h4 className="text-4xl font-black uppercase italic tracking-tighter">We Are Mobile</h4>
              <p className="mt-4 text-foreground/60 font-bold uppercase tracking-widest text-xs italic">Serving the Denver Metro Area</p>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary">Service Area</h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase italic leading-none">Proudly Serving Denver & Beyond</h3>
          <p className="text-xl text-foreground/60 font-medium leading-relaxed">
            As a local Denver business, we're proud to serve our community with professional mobile electronics installation. We bring the shop to your driveway across the Front Range.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-widest text-xs text-primary underline underline-offset-4">Primary Areas</h4>
              <ul className="space-y-2 font-bold text-foreground/80">
                <li>• Denver & Aurora</li>
                <li>• Lakewood & Arvada</li>
                <li>• Thornton & Westminster</li>
                <li>• Centennial & Littleton</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-widest text-xs text-primary underline underline-offset-4">Surrounding Areas</h4>
              <ul className="space-y-2 font-bold text-foreground/80">
                <li>• Boulder & Longmont</li>
                <li>• Castle Rock & Parker</li>
                <li>• Highlands Ranch</li>
                <li>• Broomfield</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button asChild size="lg" className="blue-gradient h-14 px-10 rounded-xl font-black uppercase tracking-widest">
              <Link href="/book">Check Availability</Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-4 px-6 h-14 rounded-xl border border-white/10 font-black uppercase tracking-widest text-sm bg-transparent hover:bg-white/5">
              <Link href="tel:+15551234567" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Call or Text Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
