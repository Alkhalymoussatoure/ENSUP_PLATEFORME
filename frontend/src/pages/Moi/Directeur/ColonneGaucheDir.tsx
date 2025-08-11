import React from 'react';

interface ColonneGaucheDirProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  onPageChange?: (page: string) => void;
}

const ColonneGaucheDir: React.FC<ColonneGaucheDirProps> = ({
  activeTab,
  handleTabChange,
  onPageChange
}) => {
  const sections = [
    { label: 'Statistique générale', key: 'statistiques' },
    { label: 'Annonce générale', key: 'annonces' },
    { label: 'Gestion des programmes et sections', key: 'gestion' },
    { label: 'Planning événementiel', key: 'evenementiel' },
    { label: 'Planning institutionnel', key: 'institutionnel' }
  ];

  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Espace Directeur</h2>
        <div className="space-y-2">
          {sections.map(section => (
            <button
              key={section.key}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === section.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                handleTabChange(section.key);
                onPageChange?.(section.key);
              }}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColonneGaucheDir;
