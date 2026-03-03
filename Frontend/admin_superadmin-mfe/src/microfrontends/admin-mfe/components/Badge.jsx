import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-white/20 text-white border border-white/30',
    success: 'bg-green-500/30 text-green-200 border border-green-400/50',
    warning: 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50',
    error: 'bg-red-500/30 text-red-200 border border-red-400/50',
    info: 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
