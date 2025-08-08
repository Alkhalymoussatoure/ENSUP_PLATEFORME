// hooks/useMessagesEnvoyes.ts
import { useEffect, useState } from 'react';
import { useUserContext } from './useUserContext';

export interface MessageEnvoye {
  id: number;
  sujet: string;
  destinataires: string[]; // liste des noms complets
  date_envoi: string;      // format 'YYYY-MM-DD'
  type: string;
  reply_to?: number | null;
  piece_jointe?: string | null;
}

export function useMessagesEnvoyes() {
  const { slug, token } = useUserContext();
  const [sentMessages, setSentMessages] = useState<MessageEnvoye[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !token) return;

    fetch(`http://localhost:8000/api/${slug}/messages/envoyer/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSentMessages(data);
        setError(null);
      })
      .catch((err) => {
        console.error('[ENVOYES] Erreur chargement :', err);
        setError("Impossible de charger les messages envoyés.");
      })
      .finally(() => setLoading(false));
  }, [slug, token]);

  return { sentMessages, loading, error };
}
