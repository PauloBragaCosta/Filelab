'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut as firebaseSignOut, User, Auth } from 'firebase/auth';
import { useRouter } from 'next/navigation';



interface SessionMenuProps {
  userName: string;
  userPhoto: string;
  auth: Auth;
}

export default function SessionMenu({ userName, userPhoto, auth }: SessionMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();



 

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage src={userPhoto} alt="User Photo" />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/home">Início</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings">Configuração</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Suporte</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}