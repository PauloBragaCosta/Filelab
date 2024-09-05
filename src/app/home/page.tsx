"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Package2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import VisaoGeral from '@/components/compopages/home';
import { CommandDialogSearch } from '@/components/compopages/CommandDialogSearch';
import { useItems } from '@/hooks/useItems';
import { useItemStatusLogs } from '@/hooks/useItemStatusLogs';
import { Item } from '@/types/item';
import { useSession } from "next-auth/react";
import SessionMenu from './SessionMenu';
import { BoxSpaceItems } from '@/components/compopages/BoxSpaceItems';
import { ItemDetails } from '@/components/compopages/ItemDetails';
import { ItemStatusLogsTable } from '@/components/compopages/ItemStatusLogsTable';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, fetchItems } = useItems();
  const { itemStatusLogs, fetchItemStatusLogs } = useItemStatusLogs();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const tabsTriggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const itemsFetchedRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && !itemsFetchedRef.current) {
      fetchItems();
      itemsFetchedRef.current = true;
    }
  }, [status, fetchItems]);

  useEffect(() => {
    if (tabsTriggerRefs.current[selectedTab]) {
      tabsTriggerRefs.current[selectedTab]?.click();
    }
  }, [selectedTab]);

  if (status === "loading") {
    return <h1>Carregando...</h1>;
  }

  if (status === "unauthenticated") {
    return null; // Evita renderizar a página enquanto redireciona
  }

  const handleSelectItem = (itemCode: string) => {
    const item = items.find((item: Item) => item.itemCode === itemCode);
    if (item) {
      setSelectedItem(item);
      setSelectedTab(item.itemType);
      fetchItemStatusLogs(itemCode);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header onSelectItem={handleSelectItem} items={items} />
        <div className="flex-1 space-y-4 p-4 pt-0 md:p-6 md:pt-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList>
              <TabsTrigger
                value="overview"
                ref={(el) => { tabsTriggerRefs.current["overview"] = el; }}
              >
                Visão geral
              </TabsTrigger>
              <TabsTrigger
                value="bloco"
                disabled={!selectedItem}
                ref={(el) => { tabsTriggerRefs.current["bloco"] = el; }}
              >
                Blocos
              </TabsTrigger>
              <TabsTrigger
                value="lamina"
                disabled={!selectedItem}
                ref={(el) => { tabsTriggerRefs.current["lamina"] = el; }}
              >
                Lâminas
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
                ref={(el) => { tabsTriggerRefs.current["notifications"] = el; }}
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
                  <div className="flex flex-col md:flex-row gap-4 pt-0 md: md:pt-0">
                    <BoxSpaceItems
                      boxNumber={selectedItem.boxNumber}
                      spaceNumber={selectedItem.spaceNumber}
                      itemType={selectedItem.itemType}
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

// Tipagem para o componente Header
function Header({ onSelectItem, items }: { onSelectItem: (itemCode: string) => void; items: Item[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link rel="stylesheet" href="/">
        <Package2 />
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Arquivo de blocos e lâminas</h1>
      <CommandDialogSearch items={items} onSelectItem={onSelectItem} />
      <Button asChild>
        <Link href="/register">
          <PlusCircle className="mr-2 h-4 w-4" />
          Fazer arquivamento
        </Link>
      </Button>
      <SessionMenu />
    </header>
  );
}
