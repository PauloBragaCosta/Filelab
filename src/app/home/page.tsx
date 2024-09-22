"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Package2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandDialogSearch } from '@/components/compopages/CommandDialogSearch';
import { useItems } from '@/hooks/useItems';
import { useItemStatusLogs } from '@/hooks/useItemStatusLogs';
import { Item } from '@/types/item';
import SessionMenu from '@/components/compopages/SessionMenu';
import dynamic from 'next/dynamic';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

// Importando componentes dinamicamente
const VisaoGeral = dynamic(() => import('@/components/compopages/visaoGeral'), { ssr: false });
const ItemDetails = dynamic(() => import('@/components/compopages/ItemDetails'), { ssr: false });
const ItemStatusLogsTable = dynamic(() => import('@/components/compopages/ItemStatusLogsTable'), { ssr: false });
const BoxSpaceItems = dynamic(() => import('@/components/compopages/BoxSpaceItems'), { ssr: false });

const Home = () => {
  const { user, loading, auth } = useFirebaseAuth();
  const { items, fetchItems } = useItems();
  const { itemStatusLogs, fetchItemStatusLogs } = useItemStatusLogs();
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<string>('overview');

  React.useEffect(() => {
    if (user && !items.length) {
      fetchItems();
    }
  }, [user, items, fetchItems]);

  const handleSelectItem = (itemCode: string) => {
    const item = items.find((item) => item.itemCode === itemCode);
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
    return null; // Isso impede que qualquer conteúdo seja renderizado enquanto redireciona
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
            <SessionMenu userName={user.name} userPhoto={user.photo} auth={auth} />
          </div>
        </header>
        <div className="flex-1 space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="flex flex-wrap justify-start gap-2">
              <TabsTrigger value="overview" className="px-3 py-1.5 text-sm">
                Visão geral
              </TabsTrigger>
              <TabsTrigger value="bloco" disabled={!selectedItem} className="px-3 py-1.5 text-sm">
                Blocos
              </TabsTrigger>
              <TabsTrigger value="lamina" disabled={!selectedItem} className="px-3 py-1.5 text-sm">
                Lâminas
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled className="px-3 py-1.5 text-sm">
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
};

export default Home;
