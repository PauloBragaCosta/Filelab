"use client";

import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Package2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CommandDialogSearch } from '@/components/compopages/CommandDialogSearch';
import { useItems } from '@/hooks/useItems';
import { useItemStatusLogs } from '@/hooks/useItemStatusLogs';
import { Item, User } from '@/types/item';
import SessionMenu from '../../components/compopages/SessionMenu';

import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const VisaoGeral = lazy(() => import('@/components/compopages/visaoGeral'));
const ItemDetails = lazy(() => import('@/components/compopages/ItemDetails'));
const ItemStatusLogsTable = lazy(() => import('@/components/compopages/ItemStatusLogsTable'));
const BoxSpaceItems = lazy(() => import('@/components/compopages/BoxSpaceItems'));




const firebaseConfig = {
  apiKey: "AIzaSyBC_T___UQrgPjRuA9Bv5pCi-Es9MHMDSk",
  authDomain: "file-lab.firebaseapp.com",
  projectId: "file-lab",
  storageBucket: "file-lab.appspot.com",
  messagingSenderId: "936477114424",
  appId: "1:936477114424:web:c3cb3ecdc342fde09226cd",
  measurementId: "G-HELPVWV0KF"
};

export default function Home() {
  const router = useRouter();
  const { items, fetchItems } = useItems();
  const { itemStatusLogs, fetchItemStatusLogs } = useItemStatusLogs();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const tabsTriggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const itemsFetchedRef = useRef(false);


  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log(firebaseUser)
        setUser({
          name: firebaseUser.displayName || "Usuário",
          photo: firebaseUser.photoURL || "",
        });
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        router.push('/signin');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (!itemsFetchedRef.current && user) {
      fetchItems();
      itemsFetchedRef.current = true;
    }
  }, [fetchItems, user]);

  const handleSelectItem = (itemCode: string) => {
    const item = items.find((item: Item) => item.itemCode === itemCode);
    if (item) {
      setSelectedItem(item);
      setSelectedTab(item.itemType);
      fetchItemStatusLogs(itemCode);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null; // This will prevent any content from rendering while redirecting
  }



  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 md:space-y-8 md:p-8">
        <header className="sticky top-0 z-30 flex flex-col items-start gap-4 border-b bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Package2 className="h-6 w-6" />
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Arquivo de blocos e lâminas</h1>
            </Link>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <CommandDialogSearch items={items} onSelectItem={handleSelectItem} />
            <Button asChild className="w-full sm:w-auto">
              <Link href="/register">
                <PlusCircle className="mr-2 h-4 w-4" />
                Fazer arquivamento
              </Link>
            </Button>
            <SessionMenu userName={user.name} userPhoto={user.photo} auth={auth} />
          </div>
        </header>
        <div className="flex-1 space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="flex flex-wrap justify-start gap-2">
              <TabsTrigger
                value="overview"
                ref={(el) => { tabsTriggerRefs.current["overview"] = el; }}
                className="px-3 py-1.5 text-sm"
              >
                Visão geral
              </TabsTrigger>
              <TabsTrigger
                value="bloco"
                disabled={!selectedItem}
                ref={(el) => { tabsTriggerRefs.current["bloco"] = el; }}
                className="px-3 py-1.5 text-sm"
              >
                Blocos
              </TabsTrigger>
              <TabsTrigger
                value="lamina"
                disabled={!selectedItem}
                ref={(el) => { tabsTriggerRefs.current["lamina"] = el; }}
                className="px-3 py-1.5 text-sm"
              >
                Lâminas
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
                ref={(el) => { tabsTriggerRefs.current["notifications"] = el; }}
                className="px-3 py-1.5 text-sm"
              >
                Expurgo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <VisaoGeral items={items} />
            </TabsContent>
            <TabsContent value="bloco" className="space-y-4">
              {selectedItem && (
                <>
                  <ItemDetails item={selectedItem} />
                  <div className="flex flex-col gap-4 md:flex-row">
                    <BoxSpaceItems
                      items={items}
                      boxNumber={selectedItem.boxNumber}
                      spaceNumber={selectedItem.spaceNumber}
                      itemType={selectedItem.itemCode}
                    />
                    <ItemStatusLogsTable logs={itemStatusLogs} />
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="lamina" className="space-y-4">
              {/* Similar structure as "bloco" tab */}
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              {/* Notifications content */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}


