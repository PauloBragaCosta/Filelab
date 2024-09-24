'use client';

import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '@/types/item'; // Certifique-se de ajustar o caminho para o seu firebaseConfig
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const useAuth = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const saveUserInDatabase = async (uid: string, displayName: string | null, photoURL: string | null) => {
        try {
            const response = await fetch('/api/tasks/saveuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid,
                    name: displayName,
                    photoURL,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar o usuário no banco de dados.');
            }

        } catch (error) {
            console.error('Erro ao salvar o usuário no banco de dados:', error);
        }
    };

    // Faz o upload da foto de perfil para o Firebase Storage e retorna o URL público
    const handleUploadProfilePicture = async (profilePicture: File): Promise<string | null> => {
        try {
            const storageRef = ref(storage, `profilePictures/${profilePicture.name}`);
            
            // Upload do arquivo com uploadBytes
            const snapshot = await uploadBytes(storageRef, profilePicture);

            // Obtém o URL da imagem armazenada
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL; // Retorna o URL público do Firebase Storage
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            return null;
        }
    };

    const handleAuth = async (
        email: string,
        password: string,
        isLogin: boolean,
        firstName?: string,
        lastName?: string,
        profilePicture?: File | null
    ) => {
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                router.push('/home');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                let photoURL = null;

                if (profilePicture) {
                    // Faz o upload da foto e obtém o URL da imagem
                    photoURL = await handleUploadProfilePicture(profilePicture);
                }

                // Atualiza o perfil do usuário no Firebase Auth
                if (user) {
                    await updateProfile(user, {
                        displayName: `${firstName} ${lastName}`,
                        photoURL: photoURL || '', // Coloca o URL da foto obtida do Firebase Storage
                    });
                }

                // Salva o usuário no banco de dados com o UID do Firebase e o photoURL
                await saveUserInDatabase(user.uid, `${firstName} ${lastName}`, photoURL);

                router.push('/home');
            }
        } catch (error) {
            setError('Erro de autenticação. Por favor, tente novamente.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleAuth,
        isLoading,
        error,
    };
};

export default useAuth;

