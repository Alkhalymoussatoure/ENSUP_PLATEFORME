import React from 'react';
import { Trash2, CornerUpLeft, XCircle } from 'lucide-react';

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

interface SectionCorbeilleProps {
  deletedMessages: Message[];
  onRestoreMessage: (id: number) => void;
  onPermanentDelete: (id: number) => void;
  refreshCorbeille?: () => void;
}

const SectionCorbeille: React.FC<SectionCorbeilleProps> = ({
  deletedMessages,
  onRestoreMessage,
  onPermanentDelete,
  refreshCorbeille
}) => {
  if (deletedMessages.length === 0) {
    return (
      <div className="p-12 text-center">
        <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Corbeille vide</h3>
        <p className="text-gray-500">Aucun message supprimé pour l'instant.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {deletedMessages.map((msg) => (
        <div key={msg.id} className="border rounded shadow-sm p-4 hover:bg-gray-50 transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold">{msg.sujet}</h4>
              <p className="text-sm text-gray-600">{msg.expediteur} · {msg.date_envoi} à {msg.heure_envoi}</p>
            </div>
            <div className="flex gap-2">
              {/* 🔄 Restaurer */}
              <button
                onClick={() => {
                  onRestoreMessage(msg.id);
                  if (refreshCorbeille) refreshCorbeille();
                }}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <CornerUpLeft size={16} />
                Restaurer
              </button>

              {/* 🗑 Supprimer définitivement */}
              <button
                onClick={() => {
                  onPermanentDelete(msg.id);
                  if (refreshCorbeille) refreshCorbeille();
                }}
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



