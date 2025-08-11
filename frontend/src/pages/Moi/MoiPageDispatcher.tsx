import { useUserContext } from '../../hooks/useUserContext';
import MoiPageEtudiant from './Etudiant/MoiPageEtudiant';
import MoiPageEnseignant from './Enseignant/MoiPageEnseignant';
import MoiPageDirecteur from './Directeur/MoiPageDirecteur';
import MoiPageAdmin from './Admin/MoiPageAdmin';
import { MoiPageProps } from './MoiPageProps';

export const MoiPageDispatcher = () => {
  const { role } = useUserContext();

  const props: MoiPageProps = {
    onPageChange: (page: string) => {
      console.log('Changement de page :', page);
    },
    onServiceClick: (serviceName: string) => {
      console.log('Service cliqué :', serviceName);
    }
  };

  switch (role) {
    case 'etudiant':
      return <MoiPageEtudiant {...props} />;
    case 'enseignant':
      return <MoiPageEnseignant {...props} />;
    case 'directeur':
      return <MoiPageDirecteur onPageChange={props.onPageChange} />;
    case 'administrateur':
      return <MoiPageAdmin />;
    default:
      return (
        <div className="text-center text-red-500 mt-20">
          Rôle inconnu ou non défini
        </div>
      );
  }
};
