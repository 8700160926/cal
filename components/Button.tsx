import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'action' | 'scientific';
  className?: string;
  doubleWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '',
  doubleWidth = false
}) => {
  const baseStyles = "relative overflow-hidden font-medium text-xl md:text-2xl transition-all duration-200 active:scale-95 flex items-center justify-center rounded-2xl select-none";
  
  const variants = {
    default: "bg-gray-800 text-white hover:bg-gray-700 shadow-sm border border-gray-700/50",
    operator: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 border border-indigo-500/50",
    action: "bg-gray-300 text-gray-900 hover:bg-white shadow-sm font-semibold", // AC, DEL
    scientific: "bg-gray-900 text-gray-300 hover:bg-gray-800 text-lg border border-gray-800"
  };

  const widthClass = doubleWidth ? "col-span-2 aspect-[2/1]" : "aspect-square";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
};

export default Button;