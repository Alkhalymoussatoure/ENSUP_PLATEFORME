import { useEffect, useState } from 'react';
import { useUserContext } from './useUserContext';

interface Message {
  id: number;
  sujet: string;
  expediteur: string;
  est_lu: boolean;
  date_envoi: string;
  type_message: string;
}

export const useMessagesNonLus = () => {
  const { slug, token } = useUserContext();
  const [messagesNonLus, setMessagesNonLus] = useState<Message[]>([]);
  const [nombreNonLus, setNombreNonLus] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessagesNonLus = async () => {
    if (!slug || !token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/messages/inbox/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      // Utilise directement le nombre de messages non lus depuis l'API
      setNombreNonLus(data.messages_non_lus || 0);

      // Optionnel : si tu veux aussi garder les messages non lus
      const allMessages: Message[] = data.messages || [];
      const nonLus = allMessages.filter((msg) => !msg.est_lu);
      setMessagesNonLus(nonLus);
    } catch (err) {
      console.error("Erreur chargement messages non lus :", err);
      setError("Impossible de charger les messages non lus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesNonLus();
  }, [slug, token]);

  return { messagesNonLus, nombreNonLus, loading, error, refresh: fetchMessagesNonLus };
};
