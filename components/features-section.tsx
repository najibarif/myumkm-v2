"use client";

import { useEffect, useRef } from "react";
import { Zap, Users, Lightbulb, Banknote, Heart, BarChart3, Bot, BookOpen } from "lucide-react"
import { animate, inView, stagger, hover } from "motion";

const features = [
  {
    icon: Zap,
    title: "AI & Otomatisasi Pemasaran",
    description: "Auto-generate konten promosi, jadwal posting ke sosial media, dan analisis engagement untuk rekomendasi strategi.",
  },
  {
    icon: Users,
    title: "Kolaborasi Antar-UMKM",
    description: "Marketplace internal, forum komunitas, dan fitur “Cari Partner” untuk mendorong joint venture.",
  },
  {
    icon: Lightbulb,
    title: "Rekomendasi Produk & Tren AI",
    description: "Dapatkan rekomendasi produk/jasa yang potensial di area Anda berdasarkan analisis tren lokal oleh AI.",
  },
  {
    icon: Banknote,
    title: "Akses Keuangan & Pendanaan",
    description: "Integrasi dengan fintech, catatan keuangan sederhana, dan platform crowdfunding internal untuk UMKM.",
  },
  {
    icon: Heart,
    title: "Manajemen Loyalitas Pelanggan",
    description: "Buat kartu member digital, kupon diskon custom, dan kirim reminder otomatis untuk pelanggan setia.",
  },
  {
    icon: BarChart3,
    title: "Analisis Kompetitor Lokal",
    description: "Bandingkan harga produk Anda dengan kompetitor sekitar dan dapatkan insight strategis.",
  },
  {
    icon: Bot,
    title: "Asisten Virtual (Chatbot AI)",
    description: "Aktifkan chatbot AI tanpa coding untuk menjawab pertanyaan pelanggan secara otomatis di berbagai platform.",
  },
  {
    icon: BookOpen,
    title: "Sistem Edukasi Interaktif",
    description: "Akses kursus singkat berbasis video & quiz, serta dapatkan bimbingan dari mentor bisnis lokal.",
  },
]

export function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      if (containerRef.current) {
        const featureItems = Array.from(containerRef.current.querySelectorAll(".feature-item"));
        const headerElements = containerRef.current.querySelectorAll('.feature-header-anim');

        // Initial state
        featureItems.forEach(item => {
          (item as HTMLElement).style.opacity = '0';
          (item as HTMLElement).style.transform = 'rotateY(-90deg)';
        });
        headerElements.forEach(el => {
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.transform = 'scale(0.9)';
        });

        inView(containerRef.current, () => {
          // Animate header - Scale up reveal
          if (headerElements.length) {
            animate(headerElements,
              { opacity: [0, 1], scale: [0.9, 1] },
              { duration: 1, type: "spring", stiffness: 100 }
            );
          }

          // Animate items - 3D Card Flip (rotateY)
          if (featureItems.length) {
            animate(featureItems,
              { opacity: [0, 1], rotateY: [-90, 0] },
              { delay: stagger(0.1), duration: 1, type: "spring", stiffness: 120, damping: 20 }
            );
          }
        }, { margin: "-100px" });

        // Minimal hover interactions
        featureItems.forEach(item => {
          hover(item, () => {
            animate(item, { scale: 1.05, zIndex: 10 }, { type: "spring", stiffness: 300, damping: 20 });
            return () => animate(item, { scale: 1, zIndex: 1 }, { type: "spring", stiffness: 300, damping: 20 });
          });
        });
      }
    } catch (e) {
      if (containerRef.current) {
        const featureItems = containerRef.current.querySelectorAll(".feature-item");
        featureItems.forEach(item => {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'none';
        });
      }
    }
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-background border-t border-border overflow-hidden" style={{ perspective: "1200px" }}>
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-8 mb-20 justify-between items-start">
          <h2 ref={titleRef} className="feature-header-anim text-4xl md:text-5xl font-bold tracking-tight max-w-md opacity-0">
            Kemampuan luar biasa.
          </h2>
          <p className="feature-header-anim text-lg text-muted-foreground max-w-lg leading-relaxed opacity-0">
            Dari otomasi pemasaran hingga analisis kompetitor. 
            Semuanya dirancang agar Anda bisa fokus pada hal yang paling penting: mengembangkan bisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="feature-item group flex flex-col items-start opacity-0 bg-card p-6 border border-border/50 rounded-2xl relative" style={{ transformOrigin: "left center" }}>
              <div className="mb-6 feature-icon text-blue-600 transition-colors duration-300">
                <feature.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
