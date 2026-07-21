"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { animate, inView, hover, press, stagger } from "motion";

export function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check for the token cookie on the client side
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    setIsAuthenticated(!!token);
    
    // VARIATION 1: Zoom out & Blur Rotate Reveal
    try {
      if (heroRef.current) {
        const titleSpans = heroRef.current.querySelectorAll('.hero-title-anim');
        const pElement = heroRef.current.querySelector('.hero-p');
        const buttonLeft = heroRef.current.querySelector('.hero-btn-left');
        const buttonRight = heroRef.current.querySelector('.hero-btn-right');

        inView(heroRef.current, () => {
          // Animate Title
          if (titleSpans.length) {
            animate(
              titleSpans,
              { opacity: [0, 1], scale: [1.2, 1], rotate: [5, 0], filter: ["blur(10px)", "blur(0px)"] },
              { duration: 1, type: "spring", stiffness: 100, damping: 15, delay: stagger(0.15) } 
            );
          }
          
          // Animate Paragraph
          if (pElement) {
            animate(pElement, 
              { opacity: [0, 1], y: [20, 0] },
              { duration: 0.8, ease: "easeOut", delay: 0.4 }
            );
          }

          // Animate Buttons Sliding from opposite sides
          if (buttonLeft) {
            animate(buttonLeft,
              { opacity: [0, 1], x: [-50, 0] },
              { duration: 0.8, type: "spring", stiffness: 100, damping: 15, delay: 0.6 }
            );
          }
          if (buttonRight) {
            animate(buttonRight,
              { opacity: [0, 1], x: [50, 0] },
              { duration: 0.8, type: "spring", stiffness: 100, damping: 15, delay: 0.6 }
            );
          }
        });

        // Hover interactions
        const buttons = heroRef.current.querySelectorAll('.hero-btn-anim');
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
      if (heroRef.current) {
        const titleSpans = heroRef.current.querySelectorAll('.hero-title-anim');
        titleSpans.forEach(el => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'none'; (el as HTMLElement).style.filter = 'none'; });
        
        const pElement = heroRef.current.querySelector('.hero-p');
        if (pElement) { (pElement as HTMLElement).style.opacity = '1'; (pElement as HTMLElement).style.transform = 'none'; }
        
        const buttons = heroRef.current.querySelectorAll('.hero-btn-anim');
        buttons.forEach(el => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'none'; });
      }
    }
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-background">
      <div className="container px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        <h1 ref={titleRef} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-8 flex flex-col items-center gap-2" style={{ perspective: "1000px" }}>
          <span className="hero-title-anim inline-block origin-bottom opacity-0 text-blue-600" style={{ transform: 'scale(1.2) rotate(5deg)', filter: 'blur(10px)' }}>Evolusi</span>
          <span className="hero-title-anim inline-block origin-bottom opacity-0 text-muted-foreground" style={{ transform: 'scale(1.2) rotate(5deg)', filter: 'blur(10px)' }}>Digital UMKM.</span>
        </h1>

        <p className="hero-p opacity-0 translate-y-5 text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-12">
          Hentikan rutinitas manual. My UMKM adalah platform serba ada untuk 
          manajemen inventaris, otomasi penjualan, dan analitik data tanpa kerumitan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto overflow-hidden px-8 py-2">
          <Button 
            size="lg" 
            className="hero-btn-anim hero-btn-left opacity-0 translate-x-[-50px] h-14 px-8 rounded-full text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto" 
            asChild
          >
            <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
              {isAuthenticated ? "Buka Dashboard" : "Mulai Gratis"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="hero-btn-anim hero-btn-right opacity-0 translate-x-[50px] h-14 px-8 rounded-full text-base font-semibold border-border hover:bg-muted w-full sm:w-auto"
          >
            Pelajari Lebih Lanjut
          </Button>
        </div>
        
      </div>
    </section>
  );
}
