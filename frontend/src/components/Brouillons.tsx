import React, { useState } from 'react';
import { 
  FileText, 
  Edit, 
  Trash2, 
  Calendar, 
  Paperclip, 
  Search,
  ChevronLeft,
  ChevronRight,
//   Send
} from 'lucide-react';

interface Draft {
  id: number;
  recipients: string;
  subject: string;
  content: string;
  lastModified: string;
  hasAttachment: boolean;
}

interface BrouillonsProps {
  drafts: Draft[];
  onCompose: () => void;
  onEditDraft: (draftId: number) => void;
  onDeleteDraft: (draftId: number) => void;
}

const Brouillons: React.FC<BrouillonsProps> = ({ 
  drafts, 
  onCompose, 
  onEditDraft, 
  onDeleteDraft 
}) => {
  const [selectedDraft, setSelectedDraft] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const draftsPerPage = 10;

  const filteredDrafts = drafts.filter(draft =>
    draft.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.recipients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredDrafts.length / draftsPerPage);
  const startIndex = (currentPage - 1) * draftsPerPage;
  const paginatedDrafts = filteredDrafts.slice(startIndex, startIndex + draftsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedDraft(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* En-tête avec actions */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCompose}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Composer</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
              <Trash2 className="h-4 w-4" />
              <span>Supprimer sélectionnés</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les brouillons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des brouillons */}
      <div className="divide-y divide-gray-200">
        {paginatedDrafts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun brouillon</h3>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de brouillons sauvegardés</p>
            <button 
              onClick={onCompose}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 mx-auto"
            >
              <Edit className="h-4 w-4" />
              <span>Composer un message</span>
            </button>
          </div>
        ) : (
          paginatedDrafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => setSelectedDraft(selectedDraft === draft.id ? null : draft.id)}
              className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                selectedDraft === draft.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {draft.hasAttachment && <Paperclip className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-700">
                          À: {truncateText(draft.recipients || 'Destinataires non définis', 30)}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Brouillon
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{draft.lastModified}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditDraft(draft.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDraft(draft.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-gray-700 font-medium">
                        {draft.subject || 'Sujet non défini'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {truncateText(draft.content || 'Contenu vide', 100)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu du brouillon (affiché si sélectionné) */}
              {selectedDraft === draft.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Brouillon</p>
                          <p className="text-sm text-gray-500">Dernière modification: {draft.lastModified}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditDraft(draft.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => onDeleteDraft(draft.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">À: </span>
                        <span className="text-sm text-gray-600">{draft.recipients || 'Destinataires non définis'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Sujet: </span>
                        <span className="text-sm text-gray-600">{draft.subject || 'Sujet non défini'}</span>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-white rounded p-3 border border-blue-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {draft.content || 'Contenu vide'}
                        </p>
                      </div>
                    </div>
                    
                    {draft.hasAttachment && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Paperclip className="h-4 w-4" />
                          <span>Fichier joint</span>
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
              Affichage de {startIndex + 1} à {Math.min(startIndex + draftsPerPage, filteredDrafts.length)} sur {filteredDrafts.length} brouillons
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

export default Brouillons;