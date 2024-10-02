import Link from "next/link";
import { Package2 } from "lucide-react";
import SessionMenu from "./SessionMenu";
import { Auth } from "firebase/auth";

interface User {
  name: string;
  photo: string; // foto pode ser opcional
}


interface HeaderProps {
  user: User;
  auth: Auth;
  text: string;
}

export default function Header({ user, auth, text }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 bg-background p-4">
      <Link href="/" className="flex items-center gap-2">
        <Package2 className="h-6 w-6" />
        <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl">{text}</h1>
      </Link>
      <SessionMenu userName={user.name} userPhoto={user.photo} auth={auth} />
    </header>
  );
}
