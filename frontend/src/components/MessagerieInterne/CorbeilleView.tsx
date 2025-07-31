import React, { useEffect, useState, useCallback } from 'react';
import { useUserContext } from '../../hooks/useUserContext';
import SectionCorbeille from './SectionCorbeille';

interface Message {
  id: number;
  expediteur: string;
  sujet: string;
  contenu: string;
  est_lu: boolean;
  est_favori?: boolean;
  fichier_joint?: string | null;
  type_message: string;
  date_envoi: string;
  heure_envoi: string;
}

const CorbeilleView: React.FC = () => {
  const { slug, token } = useUserContext();
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Fonction réutilisable pour rafraîchir les messages supprimés
  const refreshCorbeille = useCallback(() => {
    if (!slug || !token) return;
    setLoading(true);

    fetch(`http://localhost:8000/api/${slug}/messages/prendre-tous-corbeille/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDeletedMessages(data.messages || []);
        console.log("[CORBEILLE] Messages reçus :", data.messages);
        setError(null);
      })
      .catch((err) => {
        setError("Impossible de charger la corbeille.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [slug, token]);

  // ⏱ Chargement initial au montage
  useEffect(() => {
    refreshCorbeille();
  }, [refreshCorbeille]);

  // ✅ Restauration d’un message
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
        setDeletedMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        console.warn("Échec restauration :", await res.text());
      }
    } catch (err) {
      console.error("Erreur réseau restauration :", err);
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
        setDeletedMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        console.warn("Erreur suppression définitive :", await res.text());
      }
    } catch (err) {
      console.error("Erreur suppression corbeille :", err);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Chargement…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <SectionCorbeille
      deletedMessages={deletedMessages}
      onRestoreMessage={handleRestore}
      onPermanentDelete={handleDeleteForever}
      refreshCorbeille={refreshCorbeille} // 💡 tu peux l’utiliser dans le composant enfant
    />
  );
};

export default CorbeilleView;
