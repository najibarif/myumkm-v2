"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { animate, inView, hover, stagger } from "motion";

const testimonials = [
  {
    name: "Sari Dewi",
    role: "Toko Kue Sari",
    avatar: "/images/avatar-male.webp",
    content: "My UMKM mengubah cara saya berbisnis. Semua administrasi terotomatisasi sempurna.",
  },
  {
    name: "Budi Santoso",
    role: "Fashion",
    avatar: "/images/avatar-male.webp",
    content: "Fitur toko online yang minimalis & efisien. Penjualan naik 300% dalam 3 bulan.",
  },
  {
    name: "Maya Putri",
    role: "Warung Makan",
    avatar: "/images/avatar-male.webp",
    content: "Analitiknya sangat presisi untuk memahami pola pembelian pelanggan setia.",
  },
]

export function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (containerRef.current) {
        const items = Array.from(containerRef.current.querySelectorAll(".testi-item"));
        
        items.forEach(item => {
          (item as HTMLElement).style.opacity = '0';
          (item as HTMLElement).style.transform = 'translateY(80px) skewY(5deg)';
        });

        inView(containerRef.current, () => {
          if (items.length) {
            animate(items,
              { opacity: [0, 1], y: [80, 0], skewY: [5, 0] },
              { delay: stagger(0.2), duration: 1, type: "spring", stiffness: 80, damping: 20 }
            );
          }
        }, { margin: "-100px" });

        // Grayscale to color on hover
        items.forEach(item => {
          const avatar = item.querySelector('.testi-avatar');
          if (avatar) {
            hover(item, () => {
              animate(avatar, { filter: "grayscale(0%)", scale: 1.1 }, { duration: 0.4 });
              return () => animate(avatar, { filter: "grayscale(100%)", scale: 1 }, { duration: 0.4 });
            });
          }
        });
      }
    } catch (e) {
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll(".testi-item");
        items.forEach(item => {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'none';
        });
      }
    }
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-background overflow-hidden border-t border-border">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testi-item flex flex-col items-start opacity-0" style={{ transformOrigin: "bottom left" }}>
              <p className="text-2xl md:text-3xl font-serif text-foreground leading-tight tracking-tight mb-8">
                "{testimonial.content}"
              </p>
              <div className="flex items-center space-x-4 mt-auto">
                <Avatar className="h-12 w-12 border border-border testi-avatar grayscale transition-all duration-500">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-muted text-foreground font-medium">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground text-sm uppercase tracking-widest">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
