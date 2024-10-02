import { useState, useEffect, useCallback } from 'react';
import { Item } from '@/types/item';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItens, setloadingItens] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setloadingItens(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      setError((error as Error).message || 'An error occurred while fetching items');
      console.error('Error fetching overview data:', error);
    } finally {
      setloadingItens(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateItem = useCallback((updatedItem: Item) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.itemCode === updatedItem.itemCode ? { ...item, ...updatedItem } : item
      )
    );
  }, []);

  return { items, fetchItems, loadingItens, error, updateItem };
}