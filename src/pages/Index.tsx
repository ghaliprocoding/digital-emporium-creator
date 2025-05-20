
import React from 'react';
import Home from './Home';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Home />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
