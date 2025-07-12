import { useParams } from 'react-router-dom';


type ParamsType = {
  slug?: string;
};


type RoleType = 'etudiant' | 'enseignant' | 'directeur' | 'administrateur' | null;

type UserContextType = {
  role: RoleType;
  slug: string;
  token: string | null;
  email?: string;
  nom?: string;
  matricule?: string;
};

export const useUserContext = (): UserContextType => {
  const { slug = '' } = useParams<ParamsType>();
  const role = (localStorage.getItem("role") as RoleType) || null;
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || undefined;
  const nom = localStorage.getItem("nom") || undefined;
  const matricule = localStorage.getItem("matricule") || undefined;

  return { role, slug, token, email, nom, matricule };
};
