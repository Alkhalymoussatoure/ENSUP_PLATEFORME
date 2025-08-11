import { useParams } from 'react-router-dom';

type ParamsType = {
  slug?: string;
};

export type RoleType = 'etudiant' | 'enseignant' | 'directeur' | 'administrateur' | null;

export type UserContextType = {
  role: RoleType;
  slug: string;
  token: string | null;
  email?: string;
  nom?: string;
  matricule?: string;
};

export const useUserContext = (): UserContextType => {
  const { slug = '' } = useParams<ParamsType>();

  const rawRole = localStorage.getItem("role");
  const role: RoleType = rawRole === 'etudiant' || rawRole === 'enseignant' || rawRole === 'directeur' || rawRole === 'administrateur'
    ? rawRole
    : null;

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || undefined;
  const nom = localStorage.getItem("nom") || undefined;
  const matricule = localStorage.getItem("matricule") || undefined;

  return { role, slug, token, email, nom, matricule };
};
