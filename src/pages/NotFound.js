import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Lo sentimos, la página que buscas no existe.</p>
        <div className="w-16 h-1 bg-blue-500 mb-6"></div> 
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
