import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
      </Route>
    </Routes>
  );
}

export default App;
