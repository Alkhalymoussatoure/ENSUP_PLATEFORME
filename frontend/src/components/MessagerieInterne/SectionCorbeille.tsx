import React from 'react';
import { Trash2, RotateCcw, XCircle } from 'lucide-react';

interface DeletedMessage {
  id: number;
  from: string;
  subject: string;
  content: string;
  date: string;
  time: string;
}

interface SectionCorbeilleProps {
  deletedMessages: DeletedMessage[];
  onRestoreMessage: (id: number) => void;
  onPermanentDelete: (id: number) => void;
}

const SectionCorbeille: React.FC<SectionCorbeilleProps> = ({
  deletedMessages,
  onRestoreMessage,
  onPermanentDelete
}) => {
  if (deletedMessages.length === 0) {
    return (
      <div className="p-12 text-center">
        <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Corbeille vide</h3>
        <p className="text-gray-500">Aucun message supprimé pour l’instant.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {deletedMessages.map((msg) => (
        <div key={msg.id} className="p-6 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{msg.subject}</p>
              <p className="text-sm text-gray-600">{msg.from} – {msg.date} à {msg.time}</p>
              <p className="mt-2 text-gray-700 line-clamp-2">{msg.content}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onRestoreMessage(msg.id)}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                title="Restaurer"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => onPermanentDelete(msg.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                title="Supprimer définitivement"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionCorbeille;
