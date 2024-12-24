import { useState } from "react";
import { NavLink } from "react-router-dom";

const Components = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="flex justify-between items-center mb-8 md:mb-16 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center space-x-2 text-2xl">
        <i className="font-bold ri-terminal-window-line"></i>
        <span className="font-black">devSphere</span>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? (
          <i className="ri-close-large-fill"></i>
        ) : (
          <i className="ri-menu-line"></i>
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <NavLink
          to="/"
          className="text-black hover:-translate-y-1 transition-transform font-bold"
        >
          Home
        </NavLink>{" "}
        <NavLink
          to="/about"
          className="text-black hover:-translate-y-1 transition-transform font-bold"
        >
          About
        </NavLink>
        <NavLink
          to="#features"
          className="text-black hover:-translate-y-1 transition-transform font-bold"
        >
          Features
        </NavLink>{" "}
        <NavLink
          to="/login"
          className="text-black hover:-translate-y-1 transition-transform font-bold"
        >
          Login
        </NavLink>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hidden z-50">
          <div className="flex flex-col space-y-4">
            <NavLink to="#community" className="text-black font-bold">
              Home
            </NavLink>
            <NavLink to="#about" className="text-black font-bold">
              About
            </NavLink>
            <NavLink to="#features" className="text-black font-bold">
              Features
            </NavLink>
            <NavLink to="/login" className="text-black font-bold">
              Login
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Components;
