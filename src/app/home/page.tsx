"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Package2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import VisaoGeral from '@/components/compopages/visaoGeral';
import { CommandDialogSearch } from '@/components/compopages/CommandDialogSearch';
import { useItems } from '@/hooks/useItems';
import { useItemStatusLogs } from '@/hooks/useItemStatusLogs';
import { Item } from '@/types/item';
import { useSession } from "next-auth/react";
import SessionMenu from '../../components/compopages/SessionMenu';
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
    return null;
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
      <div className="flex flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 md:space-y-8 md:p-8">
        <Header onSelectItem={handleSelectItem} items={items} />
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

function Header({ onSelectItem, items }: { onSelectItem: (itemCode: string) => void; items: Item[] }) {
  return (
    <header className="sticky top-0 z-30 flex flex-col items-start gap-4 border-b bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Package2 className="h-6 w-6" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Arquivo de blocos e lâminas</h1>
        </Link>
      </div>
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
        <CommandDialogSearch items={items} onSelectItem={onSelectItem} />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Fazer arquivamento
          </Link>
        </Button>
        <SessionMenu />
      </div>
    </header>
  );
}