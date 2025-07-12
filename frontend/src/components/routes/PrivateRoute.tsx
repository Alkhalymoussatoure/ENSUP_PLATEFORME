import React, { ReactNode } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuthValidation } from '../../hooks/useAuthValidation';

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const token = localStorage.getItem('token');

  const {
    isSlugValid,
    isTokenValid,
    storedSlug,
    invalidReason,
  } = useAuthValidation(slug, token);

  if (isSlugValid === null || isTokenValid === null) {
    return <div className="py-12 text-center text-gray-600 animate-pulse">Chargement sécurisé...</div>;
  }

  if (!isSlugValid) return <Navigate to="/not-found" replace />;

  if (!token || !isTokenValid) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Accès refusé</div>
        <p className="text-gray-600">
          {invalidReason === 'token_expired' && "Votre session a expiré. Veuillez vous reconnecter."}
          {invalidReason === 'user_not_found' && "Utilisateur introuvable avec ce token."}
          {invalidReason === 'wrong_establishment' && "Ce compte n'est pas rattaché à cet établissement."}
          {invalidReason === 'network_error' && "Erreur réseau — Impossible de vérifier votre session."}
          {!invalidReason && "Accès non autorisé."}
        </p>
        <button
          onClick={() => window.location.href = `/${slug}/login`}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Se reconnecter
        </button>
      </div>
    );
  }

  if (slug !== storedSlug) return <Navigate to={`/${storedSlug}/login`} replace />;

  return <>{children}</>;
}
