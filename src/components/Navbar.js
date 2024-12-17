import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4 m-2 rounded-lg text-center">
      <Link to="/" className="text-2xl font-bold text-center text-4xl">
        DigiMe
      </Link>
    </nav>
  );
};

export default Navbar;
