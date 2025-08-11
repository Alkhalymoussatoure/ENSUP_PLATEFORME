import React from 'react';
import {
  User, Users, Calendar, FileText, MessageSquare, UserCheck,
  Clock, Award, Globe, Briefcase, Settings
} from 'lucide-react';

interface Props {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  onServiceClick?: (serviceName: string) => void;
  onPageChange?: (page: string) => void;
}

const ColonneGaucheEt: React.FC<Props> = ({
  activeTab,
  handleTabChange,
  onServiceClick
}) => {
  return (
    <div className="lg:col-span-3">
      {/* Onglets Moi / Nous */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleTabChange('moi')}
          className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
            activeTab === 'moi'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-blue-50'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <User className="h-6 w-6" />
            <span className="font-medium">Moi</span>
          </div>
        </button>
        <button
          onClick={() => handleTabChange('nous')}
          className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
            activeTab === 'nous'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-emerald-50'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Users className="h-6 w-6" />
            <span className="font-medium">Nous</span>
          </div>
        </button>
      </div>

      {/* Mes Classes */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mes Classes</h3>
          <div className="p-2 bg-blue-100 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-900">MATH-301</h4>
          <p className="text-sm text-gray-600">Mathématiques Avancées</p>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { name: 'Calendrier', icon: Calendar, key: 'calendrier' },
            { name: 'Documents de cours', icon: FileText, key: 'documents-cours' },
            { name: 'Forum de classe', icon: MessageSquare, key: 'forum-classe' },
            { name: "Infos sur l'enseignant", icon: UserCheck, key: 'infos-enseignant' },
            { name: 'Liste de mes absences', icon: Clock, key: 'liste-absences' },
            { name: "Notes d'évaluation", icon: Award, key: 'notes-evaluation' },
            { name: 'Sites web recommandés', icon: Globe, key: 'sites-recommandes' },
            { name: 'Travaux', icon: Briefcase, key: 'travaux' }
          ].map(({ name, icon: Icon, key }) => (
            <button
              key={key}
              onClick={() => onServiceClick && onServiceClick(key)}
              className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
            >
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mes Services */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mes Services</h3>
          <div className="p-2 bg-emerald-100 rounded-full">
            <Settings className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { name: 'Calendrier', icon: Calendar, key: 'calendrier-personnel' },
            { name: 'Forum par équipe', icon: MessageSquare, key: 'forum-equipe' }
          ].map(({ name, icon: Icon, key }) => (
            <button
              key={key}
              onClick={() => onServiceClick && onServiceClick(key)}
              className="w-full flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 p-2 rounded hover:bg-emerald-50"
            >
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColonneGaucheEt;
