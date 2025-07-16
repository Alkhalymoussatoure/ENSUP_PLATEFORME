import React, { useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  X, 
  Calendar, 
  Paperclip, 
  Star, 
//   User,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Message {
  id: number;
  from: string;
  subject: string;
  date: string;
  time: string;
  category: string;
  content: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  deletedAt: string;
}

interface CorbeilleProps {
  deletedMessages: Message[];
  onRestoreMessage: (messageId: number) => void;
  onPermanentDelete: (messageId: number) => void;
}

const Corbeille: React.FC<CorbeilleProps> = ({ 
  deletedMessages, 
  onRestoreMessage, 
  onPermanentDelete 
}) => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const filteredMessages = deletedMessages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Académique': 'bg-blue-100 text-blue-800',
      'Administration': 'bg-red-100 text-red-800',
      'Projet': 'bg-green-100 text-green-800',
      'Information': 'bg-yellow-100 text-yellow-800',
      'Réunion': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedMessage(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* En-tête avec actions */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
              <RotateCcw className="h-4 w-4" />
              <span>Restaurer</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
              <X className="h-4 w-4" />
              <span>Supprimer définitivement</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la corbeille..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des messages supprimés */}
      <div className="divide-y divide-gray-200">
        {paginatedMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Corbeille vide</h3>
            <p className="text-gray-500">Aucun message supprimé</p>
          </div>
        ) : (
          paginatedMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
              className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                selectedMessage === message.id ? 'bg-red-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {message.hasAttachment && <Paperclip className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-700">
                          {message.from}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(message.category)}`}>
                          {message.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{message.date}</span>
                          <span>{message.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestoreMessage(message.id);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                            title="Restaurer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPermanentDelete(message.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Supprimer définitivement"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-gray-700 line-through opacity-75">
                        {message.subject}
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        Supprimé le {message.deletedAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu du message (affiché si sélectionné) */}
              {selectedMessage === message.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {message.from.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{message.from}</p>
                          <p className="text-sm text-gray-500">{message.date} à {message.time}</p>
                          <p className="text-xs text-red-600">Supprimé le {message.deletedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onRestoreMessage(message.id)}
                          className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-100 transition-colors duration-200"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onPermanentDelete(message.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed opacity-75 line-through">
                        {message.content}
                      </p>
                    </div>
                    {message.hasAttachment && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Paperclip className="h-4 w-4" />
                          <span className="line-through opacity-75">Document_cours.pdf</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(startIndex + messagesPerPage, filteredMessages.length)} sur {filteredMessages.length} messages
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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

export default Corbeille;