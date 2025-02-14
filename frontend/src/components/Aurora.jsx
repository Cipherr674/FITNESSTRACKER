import React, { useEffect } from 'react';
import '../styles/Aurora.css';

const Aurora = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--x', e.clientX + 'px');
      document.documentElement.style.setProperty('--y', e.clientY + 'px');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="aurora-container">
      <div className="aurora aurora-1"></div>
      <div className="aurora aurora-2"></div>
      <div className="aurora aurora-3"></div>
    </div>
  );
};

export default Aurora;
