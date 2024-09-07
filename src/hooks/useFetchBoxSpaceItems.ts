import { useState, useEffect } from 'react';

// Defina a interface para os itens
interface BoxSpaceItem {
  itemCode: string;
  examType: string;
  status: string;
}

interface UseFetchBoxSpaceItemsProps {
  boxNumber: string;
  spaceNumber: string;
  itemType: string;
}

export function useFetchBoxSpaceItems({ boxNumber, spaceNumber, itemType }: UseFetchBoxSpaceItemsProps) {
  const [boxSpaceItems, setBoxSpaceItems] = useState<BoxSpaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('pages/api/tasks/searchByBoxSpace.ts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ boxNumber, spaceNumber, itemType }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items: BoxSpaceItem[] = await response.json();
        setBoxSpaceItems(items);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to fetch items');
        setBoxSpaceItems([]);
      } finally {
        setLoading(false);
      }
    }

    // Somente faça a busca se todos os parâmetros forem válidos
    if (boxNumber && spaceNumber && itemType) {
      fetchData();
    }
  }, [boxNumber, spaceNumber, itemType]);

  return { boxSpaceItems, loading, error };
}
