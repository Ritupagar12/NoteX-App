import React from 'react';

const Navbar = ({ children }) => {
  return (
    <nav className="navbar">
      <h1>NoteX</h1>
      {children}
    </nav>
  );
};


export default Navbar;
