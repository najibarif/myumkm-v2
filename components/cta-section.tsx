"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { animate, inView, hover, press, stagger } from "motion";

const benefits = [
  "Gratis selamanya (fitur dasar)",
  "Setup 5 menit",
  "Dukungan 24/7",
  "Tanpa kontrak",
]

export function CTASection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (containerRef.current) {
        const textLines = containerRef.current.querySelectorAll('.cta-mask-text');
        const benefitsList = containerRef.current.querySelectorAll('.cta-benefit');
        const buttons = containerRef.current.querySelectorAll('.cta-btn');

        // Initial setup for clip path
        (containerRef.current as HTMLElement).style.clipPath = "inset(100% 0 0 0)";

        inView(containerRef.current, () => {
          // Reveal Entire Section with Clip Path Wipe
          animate(containerRef.current!, 
            { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] }, 
            { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
          );

          // Reveal Title
          if (textLines.length) {
            animate(
              textLines,
              { y: ["100%", "0%"] },
              { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: stagger(0.1, { startDelay: 0.4 }) }
            );
          }
          
          // Reveal Benefits
          if (benefitsList.length) {
            animate(benefitsList,
              { opacity: [0, 1], scale: [0.9, 1] },
              { delay: stagger(0.1, { startDelay: 0.8 }), duration: 0.6, type: "spring", stiffness: 100 }
            );
          }

          // Reveal Buttons
          if (buttons.length) {
            animate(buttons,
              { opacity: [0, 1], y: [20, 0] },
              { duration: 0.6, ease: "easeOut", delay: stagger(0.1, { startDelay: 1.0 }) }
            );
          }
        }, { margin: "-100px" });

        // Button interactions
        buttons.forEach(btn => {
          hover(btn, () => {
            animate(btn, { scale: 1.05 }, { type: "spring", stiffness: 300, damping: 20 });
            return () => animate(btn, { scale: 1 }, { type: "spring", stiffness: 300, damping: 20 });
          });
          press(btn, () => {
            animate(btn, { scale: 0.95 }, { type: "spring", stiffness: 400, damping: 20 });
            return () => animate(btn, { scale: 1 }, { type: "spring", stiffness: 400, damping: 20 });
          });
        });
      }
    } catch (e) {
      if (containerRef.current) {
        (containerRef.current as HTMLElement).style.clipPath = "none";
        const textLines = containerRef.current.querySelectorAll('.cta-mask-text');
        textLines.forEach(el => { (el as HTMLElement).style.transform = 'none'; });
        const benefitsList = containerRef.current.querySelectorAll('.cta-benefit');
        benefitsList.forEach(el => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'none'; });
        const buttons = containerRef.current.querySelectorAll('.cta-btn');
        buttons.forEach(el => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'none'; });
      }
    }
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-blue-600 text-white overflow-hidden" style={{ clipPath: "inset(100% 0 0 0)" }}>
      <div className="container px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8">
          <span className="block overflow-hidden pb-2">
            <span className="block cta-mask-text translate-y-full">Siap Mengembangkan</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="block cta-mask-text translate-y-full text-blue-200">UMKM Anda?</span>
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="cta-benefit opacity-0 text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">
              {benefit}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Button size="lg" className="cta-btn opacity-0 translate-y-5 h-14 px-8 rounded-full text-base font-semibold bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto" asChild>
            <Link href="/auth/register">
              Mulai Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cta-btn opacity-0 translate-y-5 h-14 px-8 rounded-full text-base font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto"
          >
            <Link href="https://wa.me/6285723465738">
              Hubungi Sales
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}
