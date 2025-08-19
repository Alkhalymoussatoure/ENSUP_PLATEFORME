import React from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useMessagesEnvoyes } from '../../hooks/useMessagesEnvoyes';

const SectionEnvoyes: React.FC = () => {
  const { sentMessages, loading, error } = useMessagesEnvoyes();
  const [currentPage, setCurrentPage] = React.useState(1);
  const messagesParPage = 6;

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

  const totalPages = Math.ceil(sentMessages.length / messagesParPage);
  const indexOfLastMessage = currentPage * messagesParPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesParPage;
  const messagesCourants = sentMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="divide-y divide-gray-200">
      {messagesCourants.map((msg) => (
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

      {/* Pagination moderne */}
      <div className="flex justify-center items-center gap-2 px-6 py-4">
        {/* Flèche gauche */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
        >
          <span className="sr-only">Page précédente</span>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Numéros de page */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded text-sm transition ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Flèche droite */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
        >
          <span className="sr-only">Page suivante</span>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SectionEnvoyes;
