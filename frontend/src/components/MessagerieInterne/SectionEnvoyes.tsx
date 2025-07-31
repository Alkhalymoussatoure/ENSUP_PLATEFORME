import React from 'react';
import { Send } from 'lucide-react';

interface SentMessage {
  id: number;
  to: string;
  subject: string;
  content: string;
  date: string;
  time: string;
}

interface SectionEnvoyesProps {
  sentMessages: SentMessage[];
}

const SectionEnvoyes: React.FC<SectionEnvoyesProps> = ({ sentMessages }) => {
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
        <div key={msg.id} className="p-6 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{msg.subject}</p>
              <p className="text-sm text-gray-600">
                À : {msg.to} - {msg.date} à {msg.time}
              </p>
              <p className="mt-2 text-gray-700 line-clamp-2">{msg.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionEnvoyes;
