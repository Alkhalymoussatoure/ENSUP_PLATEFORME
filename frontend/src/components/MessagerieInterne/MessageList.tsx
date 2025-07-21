import React from 'react';
import { Inbox, Star, Paperclip, Calendar, Reply, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Message } from '@/types'; // ou adapte selon ton structure

interface MessageListProps {
  messages: Message[];
  selectedMessage: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onReply: () => void;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  getCategoryColor: (category: string) => string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessage,
  onSelect,
  onDelete,
  onReply,
  currentPage,
  totalPages,
  startIndex,
  onPageChange,
  getCategoryColor
}) => {
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
    <div className="divide-y divide-gray-200">
      {messages.map((msg) => (
        <div
          key={msg.id}
          onClick={() => onSelect(selectedMessage === msg.id ? null : msg.id)}
          className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedMessage === msg.id ? 'bg-blue-50' : ''
          } ${!msg.read ? 'bg-blue-25' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center space-x-2">
                {msg.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                {msg.hasAttachment && <Paperclip className="h-4 w-4 text-gray-400" />}
                {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.from}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(msg.category)}`}>{msg.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{msg.date}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReply();
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Répondre"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(msg.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <p className={`${!msg.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{msg.subject}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(startIndex + messages.length, startIndex + messages.length)} sur {startIndex + messages.length * totalPages} messages
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
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
                onClick={() => onPageChange(currentPage + 1)}
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
