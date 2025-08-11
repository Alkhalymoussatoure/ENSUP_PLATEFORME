import React from 'react';

interface ColonneGaucheEnsProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  onServiceClick?: (serviceName: string) => void;
  onPageChange?: (page: string) => void;
}

const ColonneGaucheEns: React.FC<ColonneGaucheEnsProps> = ({
  activeTab,
  handleTabChange,
  onServiceClick,
  onPageChange
}) => {
  const services = ['Planning', 'Évaluations', 'Documents', 'Messagerie'];

  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <div className="space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === 'moi' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange('moi')}
          >
            Moi
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === 'nous' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              handleTabChange('nous');
              onPageChange?.('nous');
            }}
          >
            Nous
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Services</h2>
        <div className="space-y-2">
          {services.map(service => (
            <button
              key={service}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => onServiceClick?.(service)}
            >
              {service}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColonneGaucheEns;
