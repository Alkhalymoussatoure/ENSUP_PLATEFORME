import React, { useEffect, useState } from 'react';
import { XCircle, Building2, Layers3, Users } from 'lucide-react';
import { useUserContext } from '../../hooks/useUserContext';

type Departement = { id: number; nom: string };
type Section = { id: number; numero_section: string };
type User = { matricule: string; nom: string; role: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: 'prive' | 'section' | 'departement', payload: string | string[]) => void;
}

const DestinataireSelectorModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const { slug, token } = useUserContext();
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDepartementIds, setSelectedDepartementIds] = useState<string[]>([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [selectedMatricules, setSelectedMatricules] = useState<string[]>([]);

  const [departementsDisabled, setDepartementsDisabled] = useState(false);
  const [sectionsDisabled, setSectionsDisabled] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAll = async () => {
      try {
        const [depRes, secRes] = await Promise.all([
          fetch(`http://localhost:8000/api/${slug}/departements`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8000/api/${slug}/sections`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDepartements(await depRes.json());
        setSections(await secRes.json());
      } catch (err) {
        console.error('Erreur chargement départements/sections', err);
      }
    };
    fetchAll();
  }, [isOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() && !searchDisabled) {
        fetch(`http://localhost:8000/api/${slug}/users/search?q=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(setUsers)
          .catch((err) => console.error("Erreur autosuggestion", err));
      } else {
        setUsers([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, slug, token, searchDisabled]);

  // 🔄 Gestion des désactivations croisées
  useEffect(() => {
    const isSearching = searchTerm.trim().length > 0;

    setDepartementsDisabled(selectedMatricules.length > 0 || selectedSectionIds.length > 0 || isSearching);
    setSectionsDisabled(selectedMatricules.length > 0 || selectedDepartementIds.length > 0 || isSearching);
    setSearchDisabled(selectedDepartementIds.length > 0 || selectedSectionIds.length > 0);
  }, [selectedDepartementIds, selectedSectionIds, selectedMatricules, searchTerm]);

  const toggleSelection = (id: string, current: string[], setter: (val: string[]) => void) => {
    setter(current.includes(id) ? current.filter(i => i !== id) : [...current, id]);
  };

  const toggleMatricule = (matricule: string) => {
    setSelectedMatricules(prev =>
      prev.includes(matricule) ? prev.filter(m => m !== matricule) : [...prev, matricule]
    );
  };

  const handleConfirm = () => {
    if (selectedMatricules.length > 0) {
      onConfirm('prive', selectedMatricules);
    } else if (selectedSectionIds.length > 0) {
      onConfirm('section', selectedSectionIds);
    } else if (selectedDepartementIds.length > 0) {
      onConfirm('departement', selectedDepartementIds);
    } else {
      return alert("Sélectionnez au moins un destinataire.");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XCircle className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sélection des destinataires</h2>

        {/* 🔍 Recherche privée */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou matricule..."
            disabled={searchDisabled}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
              searchDisabled ? 'bg-gray-100 text-gray-400' : 'focus:ring-blue-500'
            }`}
          />
          {searchTerm.trim() && users.length > 0 && (
            <div className="mt-2 bg-white border rounded shadow-sm max-h-60 overflow-auto z-10">
              {users.map((u) => {
                const isSelected = selectedMatricules.includes(u.matricule);
                return (
                  <div
                    key={u.matricule}
                    onClick={() => toggleMatricule(u.matricule)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                      isSelected ? 'font-semibold text-blue-700 bg-blue-100' : ''
                    }`}
                  >
                    {u.nom} ({u.matricule}) · {u.role}
                    {isSelected && <span className="ml-2 text-xs text-red-500">(cliquez pour retirer)</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 📁 Départements & Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Départements</h3>
            <div className="space-y-2">
              {departements.map((dep) => (
                <label key={dep.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    disabled={departementsDisabled}
                    checked={selectedDepartementIds.includes(dep.id.toString())}
                    onChange={() =>
                      toggleSelection(dep.id.toString(), selectedDepartementIds, setSelectedDepartementIds)
                    }
                  />
                  <span className={departementsDisabled ? 'text-gray-400' : 'text-gray-800'}>{dep.nom}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Sections</h3>
            <div className="space-y-2">
              {sections.map((sec) => (
                <label key={sec.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    disabled={sectionsDisabled}
                    checked={selectedSectionIds.includes(sec.id.toString())}
                    onChange={() =>
                      toggleSelection(sec.id.toString(), selectedSectionIds, setSelectedSectionIds)
                    }
                  />
                  <span className={sectionsDisabled ? 'text-gray-400' : 'text-gray-800'}>
                    Section {sec.numero_section}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Résumé des sélections */}
        <div className="mb-6 text-sm text-gray-700 space-y-4">
          {selectedDepartementIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <div>
                <strong>Départements sélectionnés :</strong>
                <ul className="list-disc ml-5">
                  {selectedDepartementIds.map((id) => {
                    const dep = departements.find((d) => d.id.toString() === id);
                    return <li key={id}>{dep?.nom || 'Département'} (ID {id})</li>;
                  })}
                </ul>
              </div>
            </div>
          )}

          {selectedSectionIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <Layers3 className="w-4 h-4 text-green-600" />
              <div>
                <strong>Sections sélectionnées :</strong>
                <ul className="list-disc ml-5">
                  {selectedSectionIds.map((id) => {
                    const sec = sections.find((s) => s.id.toString() === id);
                    return <li key={id}>Section {sec?.numero_section || id}</li>;
                  })}
                </ul>
              </div>
            </div>
          )}

          {selectedMatricules.length > 0 && (
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600" />
              <div>
                <strong>Utilisateurs sélectionnés :</strong>
                <ul className="list-disc ml-5">
                  {selectedMatricules.map((mat) => {
                    const user = users.find((u) => u.matricule === mat);
                    return <li key={mat}>{user?.nom || mat} ({mat})</li>;
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Boutons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinataireSelectorModal;
