import React, { useState } from 'react';
import { User, Users } from 'lucide-react';

interface NavigationButtonsProps {
  onPageChange?: (page: string) => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onPageChange }) => {
  const [activeButton, setActiveButton] = useState('moi');

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    if (onPageChange) {
      onPageChange(button);
    }
  };

  return (
    <div className="flex space-x-6 mb-8">
      <button 
        onClick={() => handleButtonClick('moi')}
        className={`flex-1 relative group overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-102 shadow-sm border ${
          activeButton === 'moi' 
            ? 'bg-emerald-600 shadow-lg border-emerald-600' 
            : 'bg-white hover:bg-emerald-50 shadow-sm border-emerald-200'
        }`}
      >
        <div className="relative p-5">
          <div className="flex flex-col items-center space-y-3">
            <div className={`${activeButton === 'moi' ? 'text-white' : 'text-gray-600 group-hover:text-emerald-700'}`}>
              <User className="h-8 w-8" />
            </div>
            <span className={`font-semibold text-lg ${activeButton === 'moi' ? 'text-white' : 'text-gray-700 group-hover:text-emerald-700'}`}>
              Moi
            </span>
            <div className={`text-sm ${activeButton === 'moi' ? 'text-white/80' : 'text-gray-500 group-hover:text-emerald-600'}`}>
              Espace Personnel
            </div>
          </div>
        </div>
      </button>

      <button 
        onClick={() => handleButtonClick('nous')}
        className={`flex-1 relative group overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-102 shadow-sm border ${
          activeButton === 'nous' 
            ? 'bg-emerald-600 shadow-lg border-emerald-600' 
            : 'bg-white hover:bg-emerald-50 shadow-sm border-emerald-200'
        }`}
      >
        <div className="relative p-5">
          <div className="flex flex-col items-center space-y-3">
            <div className={`${activeButton === 'nous' ? 'text-white' : 'text-gray-600 group-hover:text-emerald-700'}`}>
              <Users className="h-8 w-8" />
            </div>
            <span className={`font-semibold text-lg ${activeButton === 'nous' ? 'text-white' : 'text-gray-700 group-hover:text-emerald-700'}`}>
              Nous
            </span>
            <div className={`text-sm ${activeButton === 'nous' ? 'text-white/80' : 'text-gray-500 group-hover:text-emerald-600'}`}>
              Communauté
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default NavigationButtons;