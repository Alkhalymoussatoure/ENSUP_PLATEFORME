import React from 'react';

const ColonneDroiteAdmin: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-6">
      {/* Notifications système */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">🔔 Notifications</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Mise à jour du système prévue le 15 août</li>
          <li>• Nouveau document ajouté : “Politique RGPD.pdf”</li>
          <li>• 3 utilisateurs en attente de validation</li>
        </ul>
      </div>

      {/* Raccourci vers documents */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">📄 Documents récents</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Charte d’utilisation</li>
          <li>• Rapport mensuel - Juillet</li>
          <li>• Liste des groupes 2025</li>
        </ul>
      </div>

      {/* Sécurité / logs */}
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">🔐 Sécurité</h3>
        <p className="text-sm text-gray-600">
          Dernière connexion admin : <strong>10 août à 21h42</strong><br />
          Logs système : 12 événements critiques cette semaine
        </p>
      </div>
    </div>
  );
};

export default ColonneDroiteAdmin;
