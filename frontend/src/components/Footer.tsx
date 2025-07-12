import React from 'react';
import { School, Shield, CreditCard, FileText, Heart } from 'lucide-react';

interface FooterProps {
  onServiceClick?: (serviceName: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onServiceClick }) => {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800"></div>
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Section gauche - Logo et nom établissement */}
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-2xl transform group-hover:scale-105 transition-transform duration-300">
                <School className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">
                U Kofi Annan de Guinée
              </h3>
              <p className="text-white/70 text-sm">Excellence Académique</p>
            </div>
          </div>

          {/* Section milieu - Description du portail */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent">
                Portail Kharangni fée
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full mx-auto"></div>
            </div>
            <p className="text-white/80 leading-relaxed max-w-md mx-auto">
              Le portail Kharangni fée est votre porte d'entrée vers un ensemble de services en ligne 
              offerts par votre institution d'enseignement.
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
          </div>

          {/* Section droite - Copyright et liens */}
          <div className="space-y-6">
            <div className="text-right">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent mb-2">
                Kharangni fée
              </h3>
              <div className="flex items-center justify-end space-x-2 text-white/70 text-sm mb-4">
                <span>© Moussa et Ibrahima</span>
                <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => onServiceClick && onServiceClick('a-propos-kharagni')}
                className="w-full group flex items-center justify-end space-x-3 text-white/80 hover:text-white transition-colors duration-300 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-300">
                  À propos de Kharangni fée
                </span>
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg group-hover:scale-105 transition-transform duration-300">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </button>
              
              <button 
                onClick={() => onServiceClick && onServiceClick('securite-paiement')}
                className="w-full group flex items-center justify-end space-x-3 text-white/80 hover:text-white transition-colors duration-300 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-300">
                  Sécurité et Paiement
                </span>
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg group-hover:scale-105 transition-transform duration-300">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </button>
              
              <button 
                onClick={() => onServiceClick && onServiceClick('conditions-utilisation')}
                className="w-full group flex items-center justify-end space-x-3 text-white/80 hover:text-white transition-colors duration-300 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm"
              >
                <span className="text-sm font-medium group-hover:scale-105 transition-transform duration-300">
                  Conditions d'utilisation
                </span>
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg group-hover:scale-105 transition-transform duration-300">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Ligne de séparation animée */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-white/60 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Plateforme en ligne</span>
              </div>
              <div className="w-1 h-4 bg-white/30 rounded-full"></div>
              <span>Version 2025.1</span>
            </div>
            
            <div className="flex items-center space-x-6 text-white/60 text-sm">
              <span>Développé avec ❤️ en Guinée</span>
              <div className="flex space-x-2">
                <div className="w-8 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                <div className="w-8 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                <div className="w-8 h-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;