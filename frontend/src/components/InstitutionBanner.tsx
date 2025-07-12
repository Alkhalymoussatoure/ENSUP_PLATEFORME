import React from 'react';
import { School, MapPin, Users, Award } from 'lucide-react';


interface InstitutionBannerProps {
  logo?: string;
  name?: string;
  slug: string;
}

const InstitutionBanner: React.FC<InstitutionBannerProps> = ({ 
  // logo, 
  name = "U Kofi Annan de Guinée" 
}) => {
  return (
    <div className="relative mt-20 overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white"></div>
      <div className="absolute inset-0 bg-emerald-500/5"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-200/40 rounded-full animate-float"
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-100/50 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <School className="h-16 w-16 text-emerald-600 drop-shadow-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-emerald-800 drop-shadow-sm animate-fade-in-up">
                {name}
              </h2>
              <div className="flex items-center space-x-6 text-emerald-700">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Conakry, Guinée</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">25,000+ Étudiants</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Excellence Académique</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="text-right text-emerald-700">
              <div className="text-6xl font-black mb-2 text-emerald-600">2025-2026</div>
              <div className="text-lg font-medium">Année Académique</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionBanner;