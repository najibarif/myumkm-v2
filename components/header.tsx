"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Store, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading: isLoading, logout } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-12 max-w-7xl mx-auto">
        {/* Logo on the left */}
        <div className="flex-1 md:flex-none">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 group-hover:bg-blue-700 transition-colors">
              <Store className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
              My UMKM
            </span>
          </Link>
        </div>

        {/* Centered navigation */}
        <div className="hidden flex-1 justify-center md:flex">
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Beranda
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Marketplace
            </Link>
            <Link
              href="/forum"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Forum
            </Link>
            <Link
              href="/tentang"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Tentang
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {!isMounted ? null : !user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="rounded-full text-sm font-medium hover:text-blue-600" asChild>
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button className="rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700" asChild>
                <Link href="/auth/register">Daftar</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profil Saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border/40 md:hidden bg-background">
          <div className="container flex flex-col gap-4 py-4 px-4">
            <nav className="grid gap-2">
              <Link
                href="/"
                className="flex items-center py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/forum"
                className="flex items-center py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Forum
              </Link>
              <Link
                href="/tentang"
                className="flex items-center py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="flex items-center py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil Saya
                </Link>
              )}
            </nav>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">Mode Gelap</span>
                <ThemeToggle className="ml-2" />
              </div>

              {!isLoading && !user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-full hover:text-blue-600" asChild>
                    <Link href="/auth/login">Masuk</Link>
                  </Button>
                  <Button size="sm" className="rounded-full bg-blue-600 text-white hover:bg-blue-700" asChild>
                    <Link href="/auth/register">Daftar</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                  }}
                >
                  Keluar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
