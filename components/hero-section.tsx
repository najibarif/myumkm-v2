"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the token cookie on the client side
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    setIsAuthenticated(!!token);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse"></div>
      </div>

      <div className="container lg:px-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center items-center lg:items-start space-y-8 py-8 md:py-0 text-center lg:text-left">
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-blue-50/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800 backdrop-blur-sm w-fit">
                <span className="mr-2">🚀</span> Platform UMKM Terdepan di Indonesia
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
                Tingkatkan <br />
                <span className="hero-gradient bg-clip-text text-transparent">
                  Bisnis UMKM
                </span>
                <br />
                Ke Level Berikutnya
              </h1>
              <p className="text-base text-muted-foreground md:text-lg max-w-[460px] leading-relaxed">
                Platform ekosistem digital terlengkap untuk mengelola inventaris, belajar strategi bisnis,
                hingga terhubung dengan komunitas pengusaha sukses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start w-full sm:w-auto">
              <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto" asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
                  {isAuthenticated ? "Buka Dashboard" : "Mulai Sekarang"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-all hover:bg-white/80 dark:hover:bg-slate-900/80 w-full sm:w-auto">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Lihat Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[
                  "photo-1438761681033-6461ffad8d80",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1544005313-94ddf0286df2",
                  "photo-1554151228-14d9def656e4"
                ].map((id, i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=100&h=100`}
                      alt="User avatar"
                      width={40}
                      height={40}
                    />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-blue-600 text-[10px] font-bold text-white">
                  +10K
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Dipercaya oleh <span className="text-foreground font-bold">10,000+</span> pelaku usaha
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 flex items-center justify-center p-8 lg:p-12 lg:-translate-y-12">
              <div className="relative group w-full max-w-[400px] aspect-square rounded-[3rem] glass-card flex items-center justify-center overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:rotate-3 shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)]">
                {/* Decorative Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Logo Icon */}
                <div className="relative z-10 flex flex-col items-center space-y-4">
                  <div className="h-28 w-28 lg:h-40 lg:w-40 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                    <Store className="h-14 w-14 lg:h-20 lg:w-20 text-white" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                      My UMKM
                    </span>
                    <span className="text-xs font-medium text-muted-foreground opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-200">
                      Solusi Bisnis Digital
                    </span>
                  </div>
                </div>

                {/* Animated Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-blue-200/20 dark:border-blue-800/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-blue-200/10 dark:border-blue-800/10 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
              </div>

              {/* Floating element 1 */}
              <div className="absolute -bottom-2 -left-4 lg:-left-8 glass-card p-4 rounded-2xl hidden md:block animate-bounce-slow z-20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">Platform Status</p>
                    <p className="text-sm font-bold text-green-600">Terpercaya & Cepat</p>
                  </div>
                </div>
              </div>

              {/* Decorative Blur Backgrounds */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[80px]"></div>
              <div className="absolute -z-10 top-0 right-0 w-[40%] h-[40%] bg-purple-100 dark:bg-purple-900/10 rounded-full blur-[60px]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
