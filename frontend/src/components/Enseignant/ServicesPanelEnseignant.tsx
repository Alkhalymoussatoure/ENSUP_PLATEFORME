import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, CreditCard, FileText, Calendar, BarChart, Clock, Award, Building, Settings, BookOpen } from 'lucide-react';

interface ServicesPanelProps {
  onServiceClick?: (serviceName: string) => void;
}

const ServicesPanelEnseignant: React.FC<ServicesPanelProps> = ({ onServiceClick }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['services']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const services = [
    { icon: Users, name: 'Annuaire des enseignants', color: 'bg-blue-500', key: 'annuaire-enseignants' },
    { icon: CreditCard, name: 'Forfait étudiant', color: 'bg-green-500', key: 'forfait-etudiant' },
    { icon: FileText, name: 'Dossier personnel', color: 'bg-purple-500', key: 'dossier-personnel' },
    { icon: Calendar, name: 'Fréquentation scolaire', color: 'bg-orange-500', key: 'frequentation-scolaire' },
    { icon: BarChart, name: 'Grille de cheminement', color: 'bg-red-500', key: 'grille-cheminement' },
    { icon: Clock, name: 'Horaire de cours', color: 'bg-indigo-500', key: 'horaire-cours' },
    { icon: Award, name: 'Résultats - Bulletin d\'études', color: 'bg-yellow-500', key: 'resultats-bulletin' },
    { icon: Building, name: 'Stages', color: 'bg-teal-500', key: 'stages' }
  ];

  const resources = [
    { name: 'Documents en ligne', color: 'bg-blue-500', key: 'documents-ligne' },
    { name: 'Bibliothèque numérique', color: 'bg-green-500', key: 'bibliotheque-numerique' }
  ];

  return (
    <div className="space-y-4">
      {/* Mes Services */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <button
          onClick={() => toggleSection('services')}
          className="w-full p-4 bg-emerald-600 text-white flex items-center justify-between hover:bg-emerald-700 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Mes Services</span>
          </div>
          {expandedSections.includes('services') ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
        </button>
        
        <div className={`transition-all duration-300 ease-in-out ${
          expandedSections.includes('services') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="p-4 space-y-2">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => onServiceClick && onServiceClick(service.key)}
                className="w-full rounded-lg p-3 hover:bg-emerald-50 transition-colors duration-200 bg-white border border-emerald-100 hover:border-emerald-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${service.color} text-white`}>
                    <service.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-800">{service.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ressources éducatives */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <button
          onClick={() => toggleSection('resources')}
          className="w-full p-4 bg-emerald-500 text-white flex items-center justify-between hover:bg-emerald-600 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Ressources Éducatives</span>
          </div>
          {expandedSections.includes('resources') ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
        </button>
        
        <div className={`transition-all duration-300 ease-in-out ${
          expandedSections.includes('resources') ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="p-4 space-y-2">
            {resources.map((resource, index) => (
              <button
                key={index}
                onClick={() => onServiceClick && onServiceClick(resource.key)}
                className="w-full rounded-lg p-3 hover:bg-emerald-50 transition-colors duration-200 bg-white border border-emerald-100 hover:border-emerald-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${resource.color} text-white`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-800">{resource.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPanelEnseignant;