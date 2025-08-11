import React, { useState } from 'react';
import { User } from 'lucide-react';
import ColonneGaucheAdmin from './ColonneGaucheAdmin';
import ColonneCentraleAdmin from './ColonneCentraleAdmin';
import ColonneDroiteAdmin from './ColonneDroiteAdmin';

const MoiPageAdmin: React.FC = () => {
  const [activeService, setActiveService] = useState<string>(''); // service sélectionné

  const handleServiceChange = (service: string) => {
    setActiveService(service);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau paysage */}
      <div className="relative mt-20 h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-end">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne gauche : navigation admin */}
          <div className="lg:col-span-3">
            <ColonneGaucheAdmin
              activeService={activeService}
              handleServiceChange={handleServiceChange}
            />
          </div>

          {/* Colonne centrale : contenu du service */}
          <div className="lg:col-span-6">
            <ColonneCentraleAdmin activeService={activeService} />
          </div>

          {/* Colonne droite : widgets statiques */}
          <div className="lg:col-span-3">
            <ColonneDroiteAdmin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoiPageAdmin;
