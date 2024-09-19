// hooks/useFirebaseAuth.ts
"use client"
import { useState, useEffect } from 'react';
import { firebaseConfig, User } from '../types/item'; // Ajuste o caminho conforme necessário
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/navigation';

const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Obtém a instância do roteador
  const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

  useEffect(() => {
    // Inicializa o app Firebase dentro do hook
    

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "Usuário",
          photo: firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
        router.push('/signin'); // Redireciona para a página de login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]); // Inclui router como dependência

  return { user, loading, auth };
};

export default useFirebaseAuth;
