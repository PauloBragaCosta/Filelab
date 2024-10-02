// hooks/useItemStatusLogs.ts
"use client"
import { useState } from 'react';

export function useItemStatusLogs() {
  const [itemStatusLogs, setItemStatusLogs] = useState([]);

  const fetchItemStatusLogs = async (itemCode: string, itemType: string) => {
 

    try {
      const response = await fetch('/api/tasks/searchItemStatusLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemCode, itemType }),
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