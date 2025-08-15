import React from 'react';
import {
  Users,
  Building2,
  BookOpenText,
  CreditCard,
  ShieldCheck,
  Megaphone,
  FileText,
  LayoutDashboard
} from 'lucide-react';

interface ColonneCentraleAdminProps {
  activeService: string;
}

const ColonneCentraleAdmin: React.FC<ColonneCentraleAdminProps> = ({ activeService }) => {
  const iconClass = "w-5 h-5 text-primary";

  const renderContent = () => {
    switch (activeService) {
      case 'utilisateurs':
        return (
          <div className="flex items-center space-x-3">
            <Users className={iconClass} />
            <span><strong>Gestion des utilisateurs :</strong> Créez, modifiez ou supprimez des comptes.</span>
          </div>
        );
      case 'locaux':
        return (
          <div className="flex items-center space-x-3">
            <Building2 className={iconClass} />
            <span><strong>Gestion des locaux :</strong> Gérez les salles, bureaux et équipements.</span>
          </div>
        );
      case 'groupes':
        return (
          <div className="flex items-center space-x-3">
            <BookOpenText className={iconClass} />
            <span><strong>Groupes et cours :</strong> Organisez les groupes et assignez les cours.</span>
          </div>
        );
      case 'facturation':
        return (
          <div className="flex items-center space-x-3">
            <CreditCard className={iconClass} />
            <span><strong>Suivi de facturation :</strong> Consultez les paiements et relancez les factures.</span>
          </div>
        );
      case 'securite':
        return (
          <div className="flex items-center space-x-3">
            <ShieldCheck className={iconClass} />
            <span><strong>Sécurité / Logs :</strong> Accédez aux journaux et gérez les permissions.</span>
          </div>
        );
      case 'annonces':
        return (
          <div className="flex items-center space-x-3">
            <Megaphone className={iconClass} />
            <span><strong>Annonces système :</strong> Publiez des messages globaux ou ciblés.</span>
          </div>
        );
      case 'documents':
        return (
          <div className="flex items-center space-x-3">
            <FileText className={iconClass} />
            <span><strong>Documents officiels :</strong> Gérez les fichiers administratifs et les archives.</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-3">
            <LayoutDashboard className={iconClass} />
            <span>Bienvenue dans l'espace administrateur. Sélectionnez un service à gauche pour commencer.</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-gray-700">
      {renderContent()}
    </div>
  );
};

export default ColonneCentraleAdmin;
