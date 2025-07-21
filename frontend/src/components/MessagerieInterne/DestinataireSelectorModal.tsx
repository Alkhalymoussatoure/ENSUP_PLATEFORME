import React, { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';

type Departement = {
  id: number;
  name: string;
};

type Section = {
  id: number;
  name: string;
  departementId: number;
};

type User = {
  id: number;
  name: string;
  matricule: string;
  sectionId: number;
  departementId: number;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (destinataires: User[]) => void;
  onDepartementSelect: (id: string) => void;
  onSectionSelect: (id: string) => void;
  onSearchSelect?: (query: string) => void;
}

const DestinataireSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  onDepartementSelect,
  onSectionSelect,
  onSearchSelect,
}) => {
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDepartementIds, setSelectedDepartementIds] = useState<number[]>([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Simule les données locales
    setDepartements([
      { id: 1, name: 'Direction RH' },
      { id: 2, name: 'Développement IT' },
      { id: 3, name: 'Service Compta' },
    ]);

    setSections([
      { id: 101, name: 'RH Recrutement', departementId: 1 },
      { id: 102, name: 'RH Formation', departementId: 1 },
      { id: 201, name: 'Frontend', departementId: 2 },
      { id: 202, name: 'Backend', departementId: 2 },
      { id: 301, name: 'Paie', departementId: 3 },
    ]);

    setUsers([
      { id: 1, name: 'Marie Dupont', matricule: 'M123', sectionId: 101, departementId: 1 },
      { id: 2, name: 'Léo Martin', matricule: 'L456', sectionId: 201, departementId: 2 },
      { id: 3, name: 'Sophie Bernard', matricule: 'S789', sectionId: 301, departementId: 3 },
    ]);
  }, [isOpen]);

  const toggleSelection = (
    id: number,
    selectedIds: number[],
    setSelectedIds: (ids: number[]) => void
  ) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(updated);
  };

  const getFilteredUsers = (): User[] => {
    const bySections = users.filter((u) => selectedSectionIds.includes(u.sectionId));
    const byDepartements = users.filter((u) => selectedDepartementIds.includes(u.departementId));
    const combined = [...bySections, ...byDepartements];
    return Array.from(new Set(combined.map((u) => u.id))).map(
      (id) => combined.find((u) => u.id === id)!
    );
  };

  useEffect(() => {
    setSelectedUsers(getFilteredUsers());
  }, [selectedSectionIds, selectedDepartementIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XCircle className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sélection des destinataires</h2>

        {/* Barre de recherche optionnelle */}
        {onSearchSelect && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              onChange={(e) => onSearchSelect(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Départements</h3>
            <div className="space-y-2">
              {departements.map((dep) => (
                <label key={dep.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDepartementIds.includes(dep.id)}
                    onChange={() => {
                      toggleSelection(dep.id, selectedDepartementIds, setSelectedDepartementIds);
                      onDepartementSelect(dep.id.toString());
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-gray-800">{dep.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">Sections</h3>
            <div className="space-y-2">
              {sections.map((sec) => (
                <label key={sec.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSectionIds.includes(sec.id)}
                    onChange={() => {
                      toggleSelection(sec.id, selectedSectionIds, setSelectedSectionIds);
                      onSectionSelect(sec.id.toString());
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-gray-800">{sec.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Destinataires sélectionnés</h3>
          {selectedUsers.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun destinataire pour l'instant.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((u) => (
                <span key={u.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {u.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(selectedUsers)}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmer ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinataireSelectorModal;
