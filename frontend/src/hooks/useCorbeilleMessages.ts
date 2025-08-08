// hooks/useCorbeilleMessages.ts
import { useEffect, useState, useCallback } from 'react';

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

export function useCorbeilleMessages(slug: string, token: string | null) {
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!slug || !token) {
      setDeletedMessages([]);
      setError("Slug ou token manquant.");
      setLoading(false);
      return;
    }

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
        setError(null);
      })
      .catch((err) => {
        console.error('[Corbeille] Erreur chargement :', err);
        setError("Impossible de charger la corbeille.");
      })
      .finally(() => setLoading(false));
  }, [slug, token]);

  useEffect(() => {
    refresh(); // auto-run at mount
  }, [refresh]);

  return { deletedMessages, loading, error, refresh };
}
