"use client"

import { useAuth } from "@/hooks/useAuth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

export default function SettingsPage() {
    const { user, login } = useAuth()
    const router = useRouter()

    if (!user) {
        return (
            <div className="container mx-auto p-8 text-center bg-background min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Pengaturan Akun</h1>
                <p className="mb-4">Silakan login untuk mengakses pengaturan.</p>
                <Button onClick={() => router.push('/auth/login')}>Login Sekarang</Button>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
                    <p className="text-muted-foreground">
                        Kelola profil akun dan preferensi tampilan Anda.
                    </p>
                </div>
                <Separator />

                <Tabs defaultValue="account" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="account">Akun</TabsTrigger>
                        <TabsTrigger value="profile">Profil</TabsTrigger>
                        <TabsTrigger value="appearance">Tampilan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Akun</CardTitle>
                                <CardDescription>
                                    Update informasi dasar akun Anda di sini.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue={user.email} disabled />
                                    <p className="text-sm text-muted-foreground">Email ini digunakan untuk login dan komunikasi.</p>
                                </div>
                                <div className="pt-4">
                                    <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                                        Hapus Akun
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil Pengguna</CardTitle>
                                <CardDescription>
                                    Bagaimana orang lain melihat Anda di platform.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback className="text-lg">{(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Ubah Foto</Button>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="fullname">Nama Lengkap</Label>
                                    <Input
                                        id="fullname"
                                        defaultValue={user.user_metadata?.full_name ?? ""}
                                        placeholder="Nama Lengkap Anda"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button>Simpan Perubahan</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tampilan</CardTitle>
                                <CardDescription>
                                    Sesuaikan tampilan aplikasi dengan preferensi Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Tema Gelap</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Aktifkan mode gelap untuk mengurangi ketegangan mata.
                                            </p>
                                        </div>
                                        {/* ThemeToggle component usually handles this globally, maybe just a placeholder or hint here */}
                                        <div className="text-sm text-muted-foreground italic">
                                            Gunakan tombol tema di header untuk mengganti tema.
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
