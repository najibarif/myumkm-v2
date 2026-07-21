"use client";

import { useEffect, useRef } from "react";
import { animate, inView, stagger } from "motion";

const stats = [
  {
    target: 10000,
    suffix: "+",
    label: "UMKM Terdaftar",
    description: "Komunitas terbesar",
  },
  {
    target: 50,
    suffix: "M+",
    label: "Transaksi",
    description: "Volume dikelola",
  },
  {
    target: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Uptime Sistem",
    description: "Keandalan terjamin",
  },
  {
    target: 24,
    suffix: "/7",
    label: "Dukungan",
    description: "Siap membantu",
  },
]

export function StatsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (containerRef.current) {
        // Stagger stats in
        const statItems = Array.from(containerRef.current.querySelectorAll(".stat-item"));
        statItems.forEach(item => {
          (item as HTMLElement).style.opacity = '0';
          (item as HTMLElement).style.transform = 'translateY(20px)';
        });

        inView(containerRef.current, () => {
          if (statItems.length) {
            animate(statItems,
              { opacity: [0, 1], y: [20, 0] },
              { delay: stagger(0.15), duration: 0.8, ease: "easeOut" }
            );
          }
        }, { margin: "-50px" });

        // Number counting animation
        const numbers = containerRef.current.querySelectorAll(".stat-number");
        inView(containerRef.current, () => {
          numbers.forEach((num, index) => {
            const target = parseFloat(num.getAttribute("data-target") || "0");
            const suffix = num.getAttribute("data-suffix") || "";
            const decimals = parseInt(num.getAttribute("data-decimals") || "0", 10);
            
            setTimeout(() => {
              animate(0, target, {
                duration: 2.5, 
                ease: [0.16, 1, 0.3, 1], // Custom apple-like ease
                onUpdate: (latest) => {
                  (num as HTMLElement).textContent = latest.toFixed(decimals) + suffix;
                }
              });
            }, index * 150);
          });
        }, { margin: "-50px" });
      }
    } catch (e) {
      if (containerRef.current) {
        const statItems = containerRef.current.querySelectorAll(".stat-item");
        statItems.forEach(item => {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'none';
        });
        const numbers = containerRef.current.querySelectorAll(".stat-number");
        numbers.forEach(num => {
          const target = num.getAttribute("data-target");
          const suffix = num.getAttribute("data-suffix");
          if (target) (num as HTMLElement).textContent = target + suffix;
        });
      }
    }
  }, []);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-background border-t border-border overflow-hidden">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item flex flex-col items-center md:items-start text-center md:text-left py-8 md:py-0 md:px-8 first:pt-0 first:md:pl-0 last:pb-0 last:md:pr-0">
              <div 
                className="stat-number text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-blue-600"
                data-target={stat.target}
                data-suffix={stat.suffix}
                data-decimals={stat.decimals || 0}
              >
                0{stat.suffix}
              </div>
              <div className="text-lg font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
