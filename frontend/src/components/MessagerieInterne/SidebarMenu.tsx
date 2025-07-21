import React from 'react';
import {
  Edit,
  Inbox,
  Send,
  FileText,
  Trash2,
  Tag
} from 'lucide-react';

interface SidebarMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isComposing: boolean;
  handleCompose: () => void;
  unreadCount: number;
  draftCount: number;
  trashCount: number;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeSection,
  setActiveSection,
  isComposing,
  handleCompose,
  unreadCount,
  draftCount,
  trashCount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Messagerie</h3>

      <div className="space-y-2">
        <button
          onClick={handleCompose}
          className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
            isComposing ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-50 text-gray-700'
          }`}
        >
          <Edit className="h-5 w-5" />
          <span className={`font-medium ${isComposing ? 'font-bold' : ''}`}>Composer</span>
        </button>

        <button
          onClick={() => setActiveSection('reception')}
          className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors duration-200 ${
            activeSection === 'reception' && !isComposing ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Inbox className="h-5 w-5 text-gray-600" />
            <span className={activeSection === 'reception' && !isComposing ? 'font-bold' : 'font-medium'}>
              Réception
            </span>
          </div>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
        </button>

        <button
          onClick={() => setActiveSection('envoyes')}
          className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
            activeSection === 'envoyes' && !isComposing ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <Send className="h-5 w-5 text-gray-600" />
          <span className={activeSection === 'envoyes' && !isComposing ? 'font-bold' : 'font-medium'}>
            Envoyés
          </span>
        </button>

        <button
          onClick={() => setActiveSection('brouillons')}
          className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors duration-200 ${
            activeSection === 'brouillons' && !isComposing ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className={activeSection === 'brouillons' && !isComposing ? 'font-bold' : 'font-medium'}>
              Brouillons
            </span>
          </div>
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{draftCount}</span>
        </button>

        <button
          onClick={() => setActiveSection('corbeille')}
          className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors duration-200 ${
            activeSection === 'corbeille' && !isComposing ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Trash2 className="h-5 w-5 text-gray-600" />
            <span className={activeSection === 'corbeille' && !isComposing ? 'font-bold' : 'font-medium'}>
              Corbeille
            </span>
          </div>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{trashCount}</span>
        </button>

        <button
          onClick={() => setActiveSection('categories')}
          className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
            activeSection === 'categories' && !isComposing ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <Tag className="h-5 w-5 text-gray-600" />
          <span className={activeSection === 'categories' && !isComposing ? 'font-bold' : 'font-medium'}>
            Catégories
          </span>
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
