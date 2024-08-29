// hooks/useItemStatusLogs.ts
import { useState } from 'react';

export function useItemStatusLogs() {
  const [itemStatusLogs, setItemStatusLogs] = useState([]);

  const fetchItemStatusLogs = async (itemCode: any) => {
    try {
      const response = await fetch('/api/tasks/searchItemStatusLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const logs = await response.json();
      setItemStatusLogs(logs);
    } catch (error) {
      console.error('Error fetching item status logs:', error);
      setItemStatusLogs([]);
    }
  };

  return { itemStatusLogs, fetchItemStatusLogs };
}