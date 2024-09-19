'use client'

import { useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { firebaseConfig } from '@/types/item'

// Substitua isso com sua configuração do Firebase


// Inicialize o Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('Usuário logado com sucesso!');
                router.push('/home');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Atualizar o perfil com nome e foto de perfil
                if (user && profilePicture) {
                    const photoURL = URL.createObjectURL(profilePicture);
                    await updateProfile(user, {
                        displayName: fullName,
                        photoURL: photoURL
                    });
                    console.log('Usuário criado com sucesso e perfil atualizado!');
                }
            }
        } catch (error) {
            setError('Erro na autenticação. Por favor, tente novamente.');
            console.error(error);
        }
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Entre com sua conta' : 'Crie uma nova conta'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nome Completo</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profilePicture">Foto de Perfil</Label>
                                    <Input
                                        id="profilePicture"
                                        type="file"
                                        onChange={handleProfilePictureChange}
                                        accept="image/*"
                                    />
                                </div>
                            </>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">
                            {isLogin ? 'Entrar' : 'Cadastrar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        variant="link"
                        className="w-full"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Criar uma conta' : 'Já tenho uma conta'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
