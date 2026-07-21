import Link from "next/link"
import { Store, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Fitur", href: "/features" },
    { name: "Harga", href: "/pricing" },
    { name: "Demo", href: "/demo" },
    { name: "API", href: "/api" },
  ],
  company: [
    { name: "Tentang Kami", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Karir", href: "/careers" },
    { name: "Kontak", href: "/contact" },
  ],
  support: [
    { name: "Pusat Bantuan", href: "/help" },
    { name: "Dokumentasi", href: "/docs" },
    { name: "Status", href: "/status" },
    { name: "Komunitas", href: "/community" },
  ],
  legal: [
    { name: "Privasi", href: "/privacy" },
    { name: "Syarat", href: "/terms" },
    { name: "Keamanan", href: "/security" },
    { name: "Cookies", href: "/cookies" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-5 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 group-hover:bg-blue-700 transition-colors">
                <Store className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors">My UMKM</span>
            </Link>
            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-sm">
              Platform terbaik untuk para pelaku UMKM. Kelola bisnis Anda dengan mudah dan kembangkan usaha ke level
              yang lebih tinggi.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <social.icon className="h-5 w-5" strokeWidth={1.5} />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-6 tracking-wide text-sm">PRODUK</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 tracking-wide text-sm">PERUSAHAAN</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 tracking-wide text-sm">DUKUNGAN</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} My UMKM. Semua hak dilindungi.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
