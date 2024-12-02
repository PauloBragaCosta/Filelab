'use client'

import React, { useCallback, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Package2 } from 'lucide-react'
import { CommandDialogSearch } from '@/components/compopages/arquivo/CommandDialogSearch'
import { useItems } from '@/hooks/useItems'
import { Item } from '@/types/item'
import SessionMenu from '@/components/compopages/arquivo/SessionMenu'
import dynamic from 'next/dynamic'
import useFirebaseAuth from '@/hooks/useFirebaseAuth'
import { useItemStatusLogs } from '@/hooks/useItemStatusLogs'
import Header from '@/components/compopages/header'
import LoadingPage from '@/components/compopages/arquivo/loading-page'

// Importing components dynamically
const VisaoGeral = dynamic(() => import('@/components/compopages/arquivo/visaoGeral'), { ssr: false })
const ItemDetails = dynamic(() => import('@/components/compopages/arquivo/ItemDetails'), { ssr: false })
const ItemStatusLogsTable = dynamic(() => import('@/components/compopages/arquivo/ItemStatusLogsTable'), { ssr: false })
const BoxSpaceItems = dynamic(() => import('@/components/compopages/arquivo/BoxSpaceItems'), { ssr: false })

export default function Home() {
  const { user, loading, auth } = useFirebaseAuth()
  const { items, updateItem } = useItems()
  const { itemStatusLogs, fetchItemStatusLogs } = useItemStatusLogs()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>('overview')

  const handleSelectItem = useCallback((itemCode: string, itemType: string) => {
    const item = items.find((item) => item.itemCode === itemCode && item.itemType === itemType)
    if (item) {
      setSelectedItem(item)
      setSelectedTab(item.itemType)
      fetchItemStatusLogs(itemCode, itemType)
    }
  }, [items, fetchItemStatusLogs])

  const handleStatusChange = useCallback((newStatus: string) => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, status: newStatus }
      setSelectedItem(updatedItem)
      updateItem(updatedItem) // Supondo que você tenha uma função updateItem no seu hook useItems
    }
  }, [selectedItem, updateItem])

  if (loading) {
    return <LoadingPage/>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 md:space-y-8 md:p-8">
        <Header user={user} auth={auth} text="Arquivo de blocos e lâminas" />
        <div className="flex-1 space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <div className="flex items-center gap-4">
              <TabsList className="flex gap-2">
                <TabsTrigger
                  value="overview"
                  className="inline-flex items-center px-3 py-1.5 text-sm"
                  onClick={() => setSelectedTab('overview')}
                >
                  Visão geral
                </TabsTrigger>

                {/* Mostrar "Blocos" apenas quando `selectedTab` for 'bloco' */}
                {selectedTab === 'bloco' && (
                  <TabsTrigger
                    value="bloco"
                    disabled={!selectedItem}
                    className="inline-flex items-center px-3 py-1.5 text-sm"
                    onClick={() => setSelectedTab('bloco')}
                  >
                    Bloco
                  </TabsTrigger>
                )}

                {/* Mostrar "Lâminas" apenas quando `selectedTab` for 'lamina' */}
                {selectedTab === 'lamina' && (
                  <TabsTrigger
                    value="lamina"
                    disabled={!selectedItem}
                    className="inline-flex items-center px-3 py-1.5 text-sm"
                    onClick={() => setSelectedTab('lamina')}
                  >
                    Lâmina
                  </TabsTrigger>
                )}
              </TabsList>

              {/* CommandDialogSearch aparece ao lado do TabsList */}
              <CommandDialogSearch items={items} onSelectItem={handleSelectItem} />
            </div>


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
                      itemType={selectedItem.itemType}
                    />
                    <ItemStatusLogsTable
                      logs={itemStatusLogs}
                      onStatusChange={handleStatusChange}
                      currentItemCode={selectedItem.itemCode}
                      currentItemType={selectedItem.itemType}
                      currentUserName={user.name} // Pass the current user's name
                    />
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="lamina" className="space-y-4">
              {selectedItem && (
                <>
                  <ItemDetails item={selectedItem} />
                  <div className="flex flex-col gap-4 md:flex-row">
                    <BoxSpaceItems
                      items={items}
                      boxNumber={selectedItem.boxNumber}
                      spaceNumber={selectedItem.spaceNumber}
                      itemType={selectedItem.itemType}
                    />
                    <ItemStatusLogsTable
                      logs={itemStatusLogs}
                      onStatusChange={handleStatusChange}
                      currentItemCode={selectedItem.itemCode}
                      currentItemType={selectedItem.itemType}
                      currentUserName={user.name} // Pass the current user's name
                    />
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              {/* Notifications content */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
