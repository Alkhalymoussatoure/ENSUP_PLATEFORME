import React from 'react';
import { Users } from 'lucide-react';

const HeaderBanner = () => {
  return (
    <div className="relative mt-20 h-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Users className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Nous</h1>
        </div>
      </div>
    </div>
  );
};

export default HeaderBanner;
