import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false 
}) => {
  const baseClasses = 'bg-[#659276] rounded-xl shadow-[0px_25px_50px_-12px_#00000040]';
  const hoverClasses = hover ? 'hover:shadow-[0px_25px_50px_-12px_#00000060] transition-all duration-200' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
