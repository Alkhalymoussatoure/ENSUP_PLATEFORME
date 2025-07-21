import React from 'react';
import { Reply, Trash2 } from 'lucide-react';

interface MessageViewerProps {
  message: {
    id: number;
    from: string;
    subject: string;
    content: string;
    date: string;
    time: string;
    hasAttachment: boolean;
  };
  onReply: () => void;
  onDelete: (id: number) => void;
}

const MessageViewer: React.FC<MessageViewerProps> = ({
  message,
  onReply,
  onDelete
}) => {
  return (
    <div className="px-6 py-8 border-t border-gray-200 bg-white">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar stylisé = première lettre */}
          <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg uppercase">
            {message.from.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{message.from}</p>
            <p className="text-sm text-gray-500">{message.date} à {message.time}</p>
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
      <h2 className="text-xl font-bold text-gray-900 mb-2">{message.subject}</h2>
      <p className="text-gray-700 whitespace-pre-line">{message.content}</p>

      {/* Pièce jointe */}
      {message.hasAttachment && (
        <div className="mt-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-gray-600">📎 Pièce jointe disponible</p>
            <button className="text-blue-600 hover:underline text-sm">Télécharger</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageViewer;
