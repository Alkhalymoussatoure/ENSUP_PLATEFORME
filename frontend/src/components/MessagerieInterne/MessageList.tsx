import React, { useEffect, useState } from 'react';
import {
  Inbox,Star, Paperclip, Calendar, Reply, Trash2, ChevronLeft,
  ChevronRight,
  
} from 'lucide-react';
import { useUserContext } from '../../hooks/useUserContext';
import MessageViewer from './MessageViewer'; 
import { useNavigate } from 'react-router-dom';


interface Message {
  id: number;
  expediteur: string;
  sujet: string;
  contenu: string;
  est_lu: boolean;
  matricule_expediteur: string;
  est_favori?: boolean;
  fichier_joint?: string | null;
  type_message: string;
  date_envoi: string;
  heure_envoi: string;
}

interface MessageListProps {
  refreshCorbeille?: () => void;
   setUnreadCount?: (count: number) => void;
}

const MessageList: React.FC<MessageListProps> = ({ refreshCorbeille, setUnreadCount }) => {
  const { slug, token } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesPerPage = 10;
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = messages.slice(startIndex, startIndex + messagesPerPage);
  const totalPages = Math.max(1, Math.ceil(messages.length / messagesPerPage));
  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || null;
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug || !token) return;

    fetch(`http://localhost:8000/api/${slug}/messages/inbox/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const allMessages: Message[] = (data.messages || []).map((msg: {
          id: number;
          expediteur: string;
          matricule_expediteur: string;
          sujet: string;
          contenu: string;
          lu: boolean;
          favori?: boolean;
          fichier_joint?: string | null;
          type: string;
          date_envoi: string;
          heure_envoi: string;
        }) => ({
          id: msg.id,
          expediteur: msg.expediteur,
          matricule_expediteur: msg.matricule_expediteur,
          sujet: msg.sujet,
          contenu: msg.contenu,
          est_lu: msg.lu,
          est_favori: msg.favori ?? false,
          fichier_joint: msg.fichier_joint ?? null,
          type_message: msg.type,
          date_envoi: msg.date_envoi,
          heure_envoi: msg.heure_envoi
        }));


        setMessages(allMessages);

        const nonLus = allMessages.filter((msg) => !msg.est_lu).length;
        if (typeof setUnreadCount === 'function') {
          setUnreadCount(nonLus);
        }
      })
      .catch((err) => {
        setError("Impossible de charger les messages");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, token]);


  const handleReply = (message: Message) => {
    navigate(`/${slug}/moi/compose`, {
      state: {
        destinataires: [message.matricule_expediteur],
        sujet: `Rep: ${message.sujet}`,
        message_parent: message.id,
        type_message: 'prive',
        citation: `« ${message.expediteur} » a écrit :\n\n${message.contenu}`

      }
    });
  };


  const handleTrash = async (id: number) => {
    console.log("Envoi déplacement corbeille pour ID :", id);

    try {
      const response = await fetch(`http://localhost:8000/api/${slug}/messages/${id}/trash/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert("Accès refusé. Vous n'avez pas les droits nécessaires.");
        } else if (response.status === 404) {
          alert("Message introuvable ou déjà supprimé.");
        } else {
          alert("Erreur serveur. Veuillez réessayer plus tard.");
        }
        return;
      }


      setMessages((prev) => prev.filter((m) => m.id !== id));

      if (typeof refreshCorbeille === 'function') {
        refreshCorbeille();
      }

      if (selectedMessageId === id) {
        setSelectedMessageId(null);
      }
    } catch (err) {
      console.error("Erreur réseau ou serveur injoignable :", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/${slug}/messages/inbox/${id}/delete-user/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Erreur suppression :", errorText);
        return;
      }

      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessageId === id) {
        setSelectedMessageId(null);
      }
    } catch (err) {
      console.error("Erreur suppression définitive :", err);
    }
  };
// message marquer comme lu 
  const marquerMessageCommeLu = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/messages/marquer_lu/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === id ? { ...msg, est_lu: true } : msg
          );

          if (typeof setUnreadCount === 'function') {
            const nonLus = updated.filter((msg) => !msg.est_lu).length;
            setUnreadCount(nonLus);
          }

          return updated;
        });
      } else {
        console.warn("Échec du marquage comme lu");
      }
    } catch (err) {
      console.error("Erreur réseau lors du marquage comme lu :", err);
    }
  };


  const handleSelectMessage = async (id: number, estLu: boolean) => {
    if (!estLu) {
      await marquerMessageCommeLu(id);
    }
    setSelectedMessageId(id);
  };

// fin message marquer comme lu 

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "alerte":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Chargement des messages…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (selectedMessage) {
    return (
      <MessageViewer
        message={selectedMessage}
        onReply={() => handleReply(selectedMessage!)}
        onDelete={handleTrash}
        onBack={() => setSelectedMessageId(null)}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <div className="p-12 text-center">
        <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
        <p className="text-gray-500">Votre boîte de réception est vide</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 relative">
      {paginatedMessages.map((msg) => {
        const date = new Date(msg.date_envoi);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            key={msg.id}
            onClick={() => handleSelectMessage(msg.id, msg.est_lu)}
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors relative ${
              selectedMessageId === msg.id ? 'bg-blue-50' : ''
            } ${!msg.est_lu ? 'bg-blue-100/50' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  {msg.est_favori && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  {msg.fichier_joint && <Paperclip className="h-4 w-4 text-gray-400" />}
                  {!msg.est_lu && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-medium ${!msg.est_lu ? 'text-gray-900' : 'text-gray-700'}`}>
                        {msg.expediteur}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(msg.type_message)}`}>
                        {msg.type_message}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                        <span>{formattedTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(msg);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="Répondre"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(msg.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          title="Supprimer ou corbeille"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <p className={`${!msg.est_lu ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {msg.sujet}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {showActionMenu === msg.id && (
              <div className="absolute right-4 top-14 z-10 bg-white border shadow-lg rounded-lg p-4 space-y-2 w-64">
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    handleTrash(msg.id);

                    setShowActionMenu(null);
                  }}
                  className="w-full text-blue-600 hover:underline text-left"
                >
                  Déplacer vers la corbeille
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                    setShowActionMenu(null);
                  }}
                  className="w-full text-red-600 hover:underline text-left"
                >
                  Supprimer définitivement
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionMenu(null);
                  }}
                  className="w-full text-gray-600 hover:underline text-left"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(startIndex + paginatedMessages.length, messages.length)} sur {messages.length} messages
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default MessageList;
