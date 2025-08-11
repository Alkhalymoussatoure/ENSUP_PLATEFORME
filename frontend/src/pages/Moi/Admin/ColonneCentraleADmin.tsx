import React from 'react';

interface ColonneCentraleAdminProps {
  activeService: string;
}

const ColonneCentraleAdmin: React.FC<ColonneCentraleAdminProps> = ({ activeService }) => {
  const renderContent = () => {
    switch (activeService) {
      case 'utilisateurs':
        return <div>📋 <strong>Gestion des utilisateurs :</strong> Créez, modifiez ou supprimez des comptes.</div>;
      case 'locaux':
        return <div>🏢 <strong>Gestion des locaux :</strong> Gérez les salles, bureaux et équipements.</div>;
      case 'groupes':
        return <div>📚 <strong>Groupes et cours :</strong> Organisez les groupes et assignez les cours.</div>;
      case 'facturation':
        return <div>💳 <strong>Suivi de facturation :</strong> Consultez les paiements et relancez les factures.</div>;
      case 'securite':
        return <div>🔐 <strong>Sécurité / Logs :</strong> Accédez aux journaux et gérez les permissions.</div>;
      case 'annonces':
        return <div>📢 <strong>Annonces système :</strong> Publiez des messages globaux ou ciblés.</div>;
      case 'documents':
        return <div>📄 <strong>Documents officiels :</strong> Gérez les fichiers administratifs et les archives.</div>;
      default:
        return <div>👋 Bienvenue dans l’espace administrateur. Sélectionnez un service à gauche pour commencer.</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-gray-700">
      {renderContent()}
    </div>
  );
};

export default ColonneCentraleAdmin;
