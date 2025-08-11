import React from 'react';

const ColonneCentraleEns: React.FC = () => {
  return (
    <div className="lg:col-span-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue, Enseignant</h2>
        <p className="text-gray-700">
          Cette section centrale peut contenir vos informations personnelles, vos cours en cours,
          les statistiques de vos élèves, ou tout autre contenu pédagogique.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Dernières activités</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Correction des évaluations de 3e année</li>
          <li>Ajout de documents pour le cours de mathématiques</li>
          <li>Réponse à 5 messages dans la messagerie</li>
        </ul>
      </div>
    </div>
  );
};

export default ColonneCentraleEns;
