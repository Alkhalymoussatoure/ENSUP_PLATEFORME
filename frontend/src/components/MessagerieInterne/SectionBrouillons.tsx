import React from 'react';
import { FileText, Pencil, Trash2 } from 'lucide-react';

interface Draft {
  id: number;
  subject: string;
  content: string;
  date: string;
}

interface SectionBrouillonsProps {
  drafts: Draft[];
  onEditDraft: (id: number) => void;
  onDeleteDraft: (id: number) => void;
  onCompose: () => void;
}

const SectionBrouillons: React.FC<SectionBrouillonsProps> = ({
  drafts,
  onEditDraft,
  onDeleteDraft,
  onCompose
}) => {
  if (drafts.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun brouillon</h3>
        <p className="text-gray-500">Vous n'avez pas encore enregistré de brouillons.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {drafts.map((draft) => (
        <div key={draft.id} className="p-6 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{draft.subject || 'Sans sujet'}</p>
              <p className="text-sm text-gray-600">{draft.date}</p>
              <p className="mt-2 text-gray-700 line-clamp-2">{draft.content}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEditDraft(draft.id)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                title="Modifier"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDeleteDraft(draft.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="px-6 py-4 border-t">
        <button
          onClick={onCompose}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Rédiger un nouveau message
        </button>
      </div>
    </div>
  );
};

export default SectionBrouillons;
