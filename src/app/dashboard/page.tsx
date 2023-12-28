"use client"





import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Link from 'next/link'
import Dashboard from '@/app/dashboard/layout';

function HomePage() {
  return (
   
      <Routes>
        <Route path="/home" element={<h1>hellow word sem nada</h1>} />
        <Route path="/home" element={<h1>hellow word</h1>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
   
  );
}

export default function App() {
  return (
    <Router>
      <h2>Deu certo a lywout aeee</h2>
    </Router>
  );
}
