import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Store, Users, Target, ShieldCheck } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <div className="flex">
                <DashboardSidebar />
                <main className="flex-1 relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-32">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px]"></div>
                    </div>

                    <div className="container px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                                Tentang <span className="hero-gradient bg-clip-text text-transparent">My UMKM</span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Platform ekosistem digital terpercaya untuk memajukan Usaha Mikro, Kecil, dan Menengah melalu teknologi.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                            <div className="glass-card p-8 rounded-3xl space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Misi Kami</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Memberdayakan UMKM dengan alat digital yang intuitif untuk kemajuan bisnis Anda.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Komunitas</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Membangun jaringan bisnis yang solid di seluruh Indonesia.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Keamanan</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Enkripsi tingkat tinggi untuk menjaga setiap data transaksi dan profil Anda.
                                </p>
                            </div>
                        </div>

                        <div className="mt-20 flex flex-col items-center">
                            <div className="relative group w-full max-w-[300px] aspect-square rounded-[2rem] glass-card flex items-center justify-center overflow-hidden transition-all duration-700 hover:scale-[1.05] shadow-[0_0_50px_-12px_rgba(37,99,235,0.2)]">
                                {/* Logo Icon consistent with Hero */}
                                <div className="relative z-10 flex flex-col items-center space-y-4">
                                    <div className="h-24 w-24 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl transition-transform duration-700 group-hover:scale-110">
                                        <Store className="h-12 w-12 text-white" />
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        My UMKM
                                    </span>
                                </div>
                                {/* Animated Rings */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-blue-200/20 dark:border-blue-800/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                            </div>

                            <div className="mt-12 text-center max-w-2xl">
                                <h2 className="text-2xl font-bold mb-4">Membangun Masa Depan</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Visi kami adalah menjadi katalisator utama transformasi digital bagi UMKM di Indonesia,
                                    menciptakan ekosistem yang berkelanjutan dan mampu bersaing.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
