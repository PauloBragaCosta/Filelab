'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { firebaseConfig } from '@/types/item'
import { Loader2, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function AuthPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('Usuário logado com sucesso!');
                router.push('/home');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Atualiza o perfil com nome completo e foto de perfil
                if (user && profilePicture) {
                    const photoURL = URL.createObjectURL(profilePicture);
                    await updateProfile(user, {
                        displayName: `${firstName} ${lastName}`,
                        photoURL: photoURL
                    });
                    console.log('Usuário criado com sucesso e perfil atualizado!');
                }
                router.push('/home');
            }
        } catch (error) {
            setError('Erro de autenticação. Por favor, tente novamente.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
                {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Alternar tema</span>
            </Button>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{isLogin ? 'Entrar' : 'Cadastrar'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Digite seu e-mail abaixo para entrar na sua conta' : 'Digite suas informações para criar uma conta'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="grid gap-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">Nome</Label>
                                    <Input
                                        id="first-name"
                                        placeholder="João"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Sobrenome</Label>
                                    <Input
                                        id="last-name"
                                        placeholder="Silva"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Senha</Label>
                                {isLogin && (
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Esqueceu sua senha?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <div className="grid gap-2">
                                <Label htmlFor="profilePicture">Foto de Perfil</Label>
                                <Input
                                    id="profilePicture"
                                    type="file"
                                    onChange={handleProfilePictureChange}
                                    accept="image/*"
                                />
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isLogin ? 'Entrando...' : 'Criando conta...'}
                                </>
                            ) : (
                                isLogin ? 'Entrar' : 'Criar conta'
                            )}
                        </Button>
                        <Button variant="outline" className="w-full" disabled={isLoading}>
                            {isLogin ? 'Entrar com Google' : 'Cadastrar com GitHub'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                        <Button
                            variant="link"
                            className="underline p-0"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Cadastre-se' : 'Entre'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}