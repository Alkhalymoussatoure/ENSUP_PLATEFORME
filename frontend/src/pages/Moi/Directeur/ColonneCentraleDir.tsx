import React from 'react';

const ColonneCentraleDir: React.FC = () => {
  const directeur = {
    nom: 'Khaly Diop',
    fonction: 'Directeur pédagogique',
    etablissement: 'Lycée Horizon Nord'
  };

  const actions = [
    { label: '📊 Voir les statistiques', key: 'statistiques' },
    { label: '📢 Créer une annonce', key: 'annonce' },
    { label: '📚 Gérer un programme', key: 'gestion' },
    { label: '🗓️ Ajouter un événement', key: 'evenement' }
  ];

  const agenda = [
    { heure: '09:00', titre: 'Réunion avec les coordinateurs' },
    { heure: '11:30', titre: 'Validation du planning institutionnel' },
    { heure: '15:00', titre: 'Entretien avec un enseignant' }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      {/* Profil */}
      <div>
        <h2 className="text-xl font-semibold mb-2">👤 Profil</h2>
        <p><strong>Nom :</strong> {directeur.nom}</p>
        <p><strong>Fonction :</strong> {directeur.fonction}</p>
        <p><strong>Établissement :</strong> {directeur.etablissement}</p>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Modifier mes informations
        </button>
      </div>

      {/* Accès rapide */}
      <div>
        <h2 className="text-xl font-semibold mb-2">⚡ Accès rapide</h2>
        <div className="space-y-2">
          {actions.map(action => (
            <button
              key={action.key}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => console.log('Action :', action.key)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📅 Agenda du jour</h2>
        <ul className="list-disc pl-5 space-y-1">
          {agenda.map((item, index) => (
            <li key={index}>
              <strong>{item.heure}</strong> — {item.titre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ColonneCentraleDir;
