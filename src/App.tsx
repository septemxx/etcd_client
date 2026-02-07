import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ConnectionManager from './pages/ConnectionManager';
import KVBrowser from './pages/KVBrowser';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ConnectionManager />} />
          <Route path="browser" element={<KVBrowser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
