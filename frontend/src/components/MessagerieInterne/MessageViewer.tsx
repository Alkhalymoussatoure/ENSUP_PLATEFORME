import React from 'react';
import { Reply, Trash2, ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  expediteur: string;
  sujet: string;
  contenu: string;
  date_envoi: string;
  heure_envoi: string;
  fichier_joint?: string | null; // ✅ seul champ nécessaire
}

interface MessageViewerProps {
  message: Message | null;
  onReply: () => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}

const MessageViewer: React.FC<MessageViewerProps> = ({
  message,
  onReply,
  onDelete,
  onBack
}) => {
  if (!message) return null;

  return (
    <div className="px-6 py-8 border-t border-gray-200 bg-white">
      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la boîte de réception
      </button>

      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg uppercase">
            {message.expediteur.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{message.expediteur}</p>
            <p className="text-sm text-gray-500">
              {message.date_envoi} à {message.heure_envoi}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onReply}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
            title="Répondre"
          >
            <Reply className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(message.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
            title="Supprimer"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Sujet + contenu */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">{message.sujet}</h2>
      <p className="text-gray-700 whitespace-pre-line">{message.contenu}</p>

      {/* 📎 Fichier joint enrichi */}
      {message.fichier_joint && (
        <div className="mt-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">📎 Fichier joint disponible</p>
              <p className="text-xs text-gray-400 truncate max-w-xs">{message.fichier_joint}</p>
            </div>
            <a
              href={message.fichier_joint}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
            >
              Voir / Télécharger
            </a>
          </div>
        </div>
      )}

    </div>
  );
};

export default MessageViewer;
