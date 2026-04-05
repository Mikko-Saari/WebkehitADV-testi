import React from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import FrontPageContent from './components/FrontPageContent';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <Header title="Varaosa kauppa" />
      <NavBar />
      <FrontPageContent />
      <Footer text="© Varaosa kauppa 2025" />
    </div>
  );
}

export default App;
