import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
const CustomCursor = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLinkHover = () => {
    setIsHoveringLink(true);
  };

  const handleLinkLeave = () => {
    setIsHoveringLink(false);
  };

  return (
    <>
      <div 
        className={`fixed z-[100] rounded-full pointer-events-none transition-all duration-300 ease-out 
          ${isHoveringLink ? 'w-[40px] h-[40px] bg-white' : 'w-[20px] h-[20px] bg-white/20'}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      ></div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === Navbar) {
            return React.cloneElement(child, {
              onLinkHover: handleLinkHover,
              onLinkLeave: handleLinkLeave,
            });
          }
        }
        return child;
      })}
    </>
  );
};

export default CustomCursor;