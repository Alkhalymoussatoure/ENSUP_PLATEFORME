import React from 'react';
import { Send,Paperclip } from 'lucide-react';
import { useMessagesEnvoyes } from '../../hooks/useMessagesEnvoyes';

const SectionEnvoyes: React.FC = () => {
  const { sentMessages, loading, error } = useMessagesEnvoyes();

  if (loading) {
    return <div className="p-6 text-gray-500">Chargement des messages envoyés…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (sentMessages.length === 0) {
    return (
      <div className="p-12 text-center">
        <Send className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message envoyé</h3>
        <p className="text-gray-500">Vous n'avez pas encore envoyé de message.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {sentMessages.map((msg) => (
        <div key={msg.id} className="p-6 bg-white hover:bg-gray-50 transition">
          <p className="font-semibold text-gray-900">{msg.sujet}</p>
          <p className="text-sm text-gray-600">
            À : {msg.destinataires.join(', ')} · {msg.date_envoi}
          </p>
          {msg.piece_jointe && (
            <p className="mt-1 text-sm text-blue-600 flex items-center gap-1">
              <Paperclip size={14} className="text-blue-600" />
              Pièce jointe : {msg.piece_jointe}
            </p>
          )}

        </div>
      ))}
    </div>
  );
};

export default SectionEnvoyes;
