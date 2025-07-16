import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">404 - Page non trouvée</h1>
        <p className="text-gray-600 mb-6">
          Oups… la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <button
          onClick={() => navigate(`/${slug}/`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
