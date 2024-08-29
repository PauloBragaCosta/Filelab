// hooks/useItems.ts
import { Item } from '@/types/item';
import { useState } from 'react';



export function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/tasks/overview');
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    }
  };

  return { items, fetchItems };
}