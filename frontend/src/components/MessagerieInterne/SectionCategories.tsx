import React from 'react';
import { Tag } from 'lucide-react';

interface CategorizedMessage {
  id: number;
  category: string;
  subject: string;
  content: string;
  from: string;
  date: string;
  time: string;
}

interface SectionCategoriesProps {
  messages: CategorizedMessage[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const SectionCategories: React.FC<SectionCategoriesProps> = ({
  messages,
  onSelectCategory,
  selectedCategory
}) => {
  const uniqueCategories = Array.from(new Set(messages.map(m => m.category)));

  const filteredMessages = messages.filter(m => m.category === selectedCategory);

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Catégories</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucun message dans cette catégorie.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{msg.subject}</p>
                  <p className="text-sm text-gray-600">
                    {msg.from} – {msg.date} à {msg.time}
                  </p>
                </div>
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-2 text-gray-700 line-clamp-2">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionCategories;
