import React from 'react';
import { useUserContext } from '../../hooks/useUserContext';
import InstitutionBanner from '../../components/InstitutionBanner';
import NavigationButtons from '../../components/NavigationButtons';
import Footer from '../../components/Footer';

// Composants par rôle
import HomePageEtudiant from './HomePageEtudiant';
import HomePageEnseignant from './HomePageEnseignant';
import HomePageDirecteur from './HomePageDirecteur';
import HomePageAdmin from './HomePageAdmin';
// servicePanel par role 
import ServicesPanelEtudiant from '../../components/Etudiant/ServicesPanelEtudiant';
import ServicesPanelEnseignant from '../../components/Enseignant/ServicesPanelEnseignant';
import ServicesPanelDirecteur from '../../components/Directeur/ServicesPanelDirecteur';
import ServicesPanelAdmin from '../../components/Admin/ServicesPanelAdmin';


type Props = {
  onPageChange: (page: string) => void;
  onServiceClick: (serviceName: string) => void;
  onNavigateToMessages: () => void;
};

export default function HomeDispatcher({
  onPageChange,
  onServiceClick,
  onNavigateToMessages
}: Props): JSX.Element {
  const { role, slug } = useUserContext();

  const renderContent = () => {
    switch (role) {
      case 'etudiant':
        return <HomePageEtudiant onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />;
      case 'enseignant':
        return <HomePageEnseignant onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />;
      case 'directeur':
        return <HomePageDirecteur onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />;
      case 'administrateur':
        return <HomePageAdmin onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />;
      default:
        return <div className="text-gray-500">Rôle non reconnu</div>;
    }
  };

  return (
    <>
      <InstitutionBanner slug={slug} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
             <NavigationButtons onPageChange={onPageChange} />
              {role === 'etudiant' && <ServicesPanelEtudiant onServiceClick={onServiceClick} />}
              {role === 'enseignant' && <ServicesPanelEnseignant onServiceClick={onServiceClick} />}
              {role === 'directeur' && <ServicesPanelDirecteur onServiceClick={onServiceClick} />}
              {role === 'administrateur' && <ServicesPanelAdmin onServiceClick={onServiceClick} />}
          </div>
          <div className="lg:col-span-8">
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer onServiceClick={onServiceClick} />
    </>
  );
}
