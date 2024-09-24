"use client";

import { useState, useEffect } from 'react';
import { firebaseConfig, User as AppUser } from '../types/item'; // Ajuste o caminho conforme necessário
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { useRouter } from 'next/navigation';

// Inicialização segura do Firebase App fora do hook para evitar múltiplas inicializações
let firebaseApp: FirebaseApp | null = null;
if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig);
}

const useFirebaseAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null); // Estado para o usuário customizado
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(firebaseApp!); // Obtenção da instância de autenticação

  useEffect(() => {
    // Função para buscar dados do usuário via API
    const fetchUserDataFromAPI = async (uid: string) => {
      try {
        const response = await fetch('/api/user/uidfind', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              uid
          }),
      });
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        const userData = await response.json();
        setUser({
          name: userData.name || 'Usuário',
          photo: userData.photoURL || '', // photoURL do usuário vindo da API
        });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário na API:', error);
      }
    };

    // Escuta as mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Se o usuário está autenticado, busque os dados via API com o UID
        fetchUserDataFromAPI(firebaseUser.uid);
      } else {
        setUser(null);
        router.push('/signin'); // Redireciona para a página de login se não autenticado
      }
      setLoading(false); // Finaliza o estado de carregamento
    });

    // Cleanup da função de escuta quando o componente é desmontado
    return () => unsubscribe();
  }, [auth, router]);

  return { user, loading, auth };
};

export default useFirebaseAuth;
