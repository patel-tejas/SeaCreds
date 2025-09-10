import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', current: true },
    { name: 'About', href: '/about', current: false },
    { name: 'How It Works', href: '/how-it-works', current: false },
    { name: 'Marketplace', href: '/exchange', current: false },
    { name: 'Contact', href: '#contact', current: false },
  ];

  return (
    <>
      <style jsx="true">{`
        .nav-gradient {
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%);
          backdrop-filter: blur(10px);
        }
        
        .menu-slide {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #4e54c8, #8f94fb);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::before {
          width: 100%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .block-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .block-pulse:nth-child(2) {
          animation-delay: 0.3s;
        }

        .block-pulse:nth-child(3) {
          animation-delay: 0.6s;
        }
      `}</style>

      <nav className="fixed top-0 left-0 w-full z-50 nav-gradient border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Blockchain Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative flex items-center">
                {/* Blockchain Blocks */}
                <div className="flex items-end space-x-1">
                  <div className="block-pulse w-3 h-3 bg-cyan-400 rounded-sm"></div>
                  <div className="block-pulse w-3 h-4 bg-cyan-500 rounded-sm"></div>
                  <div className="block-pulse w-3 h-3 bg-cyan-400 rounded-sm"></div>
                </div>
                
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-500/30 -z-10 transform -translate-y-1/2"></div>
              </div>
              
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-['Orbitron']">
                SeaCreds
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 font-medium nav-link px-1 py-2 font-['Exo'] group"
                >
                  {link.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
              
              {/* CTA Button */}
              <Link
                to="/exchange"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 transform font-['Exo'] group relative overflow-hidden"
              >
                <span className="relative z-10">Launch App</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-all duration-300"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden menu-slide">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-[#0a0a0a] to-[#16213e] border-t border-cyan-500/20">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-300 font-['Exo'] border-b border-cyan-500/10 last:border-b-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link
                  to="/exchange"
                  className="block w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 font-['Exo'] hover:scale-105 transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Launch App
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Add spacing for fixed nav */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;