import React from 'react';
import { Trash2, CornerUpLeft, XCircle } from 'lucide-react';
import { useUserContext } from '../../hooks/useUserContext';
import { useCorbeilleMessages } from '../../hooks/useCorbeilleMessages';

const SectionCorbeille: React.FC = () => {
  const { slug, token }: { slug: string; token: string | null } = useUserContext();

  // 👉 Pas de hook appelé tant que token est null
  if (!token) {
    return (
      <div className="p-12 text-center text-red-600">
        Authentification requise. Aucun token trouvé.
      </div>
    );
  }

  // ✅ Appel sécurisé du hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { deletedMessages, loading, error, refresh } = useCorbeilleMessages(slug, token);

  // 🔄 Restauration d’un message
  const handleRestore = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/messages/${id}/restore/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        refresh();
      } else {
        console.warn('Échec restauration :', await res.text());
      }
    } catch (err) {
      console.error('Erreur restauration :', err);
    }
  };

  // 🗑 Suppression définitive
  const handleDeleteForever = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/messages/inbox/${id}/delete-user/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        refresh();
      } else {
        console.warn('Erreur suppression :', await res.text());
      }
    } catch (err) {
      console.error('Erreur suppression définitive :', err);
    }
  };

  // ⏳ Chargement ou erreur
  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">Chargement de la corbeille…</div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-600">{error}</div>
    );
  }

  // 📭 Aucun message supprimé
  if (deletedMessages.length === 0) {
    return (
      <div className="p-12 text-center">
        <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Corbeille vide</h3>
        <p className="text-gray-500">Aucun message supprimé pour l'instant.</p>
      </div>
    );
  }

  // ✅ Liste des messages supprimés
  return (
    <div className="space-y-4 p-4">
      {deletedMessages.map((msg) => (
        <div key={msg.id} className="border rounded shadow-sm p-4 hover:bg-gray-50 transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold">{msg.sujet}</h4>
              <p className="text-sm text-gray-600">
                {msg.expediteur} · {msg.date_envoi} à {msg.heure_envoi}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRestore(msg.id)}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <CornerUpLeft size={16} />
                Restaurer
              </button>
              <button
                onClick={() => handleDeleteForever(msg.id)}
                className="flex items-center gap-1 text-red-600 hover:underline"
              >
                <XCircle size={16} />
                Supprimer
              </button>
            </div>
          </div>
          <p className="mt-2 text-gray-700">{msg.contenu}</p>
        </div>
      ))}
    </div>
  );
};

export default SectionCorbeille;
