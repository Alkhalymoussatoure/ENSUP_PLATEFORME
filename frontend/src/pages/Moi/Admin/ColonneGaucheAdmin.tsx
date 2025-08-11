import React from 'react';

interface ColonneGaucheAdminProps {
  activeService: string;
  handleServiceChange: (service: string) => void;
}

const ColonneGaucheAdmin: React.FC<ColonneGaucheAdminProps> = ({
  activeService,
  handleServiceChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Services Admin</h2>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'utilisateurs' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('utilisateurs')}
      >
        👥 Gestion des utilisateurs
      </button>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'locaux' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('locaux')}
      >
        🏢 Gestion des locaux
      </button>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'groupes' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('groupes')}
      >
        📚 Groupes et cours
      </button>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'facturation' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('facturation')}
      >
        💳 Suivi de facturation
      </button>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'securite' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('securite')}
      >
        🔐 Sécurité / Logs
      </button>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'annonces' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('annonces')}
      >
        📢 Annonces système
      </button>

      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeService === 'documents' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleServiceChange('documents')}
      >
        📄 Documents officiels
      </button>
    </div>
  );
};

export default ColonneGaucheAdmin;
