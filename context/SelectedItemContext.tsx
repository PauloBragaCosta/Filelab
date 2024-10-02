import React, { createContext, useContext, useState } from 'react';
import { Item } from '@/types/item';

interface SelectedItemContextType {
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
}

const SelectedItemContext = createContext<SelectedItemContextType | undefined>(undefined);

export function SelectedItemProvider({ children }: { children: React.ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SelectedItemContext.Provider>
  );
}

export function useSelectedItem() {
  const context = useContext(SelectedItemContext);
  if (context === undefined) {
    throw new Error('useSelectedItem must be used within a SelectedItemProvider');
  }
  return context;
}