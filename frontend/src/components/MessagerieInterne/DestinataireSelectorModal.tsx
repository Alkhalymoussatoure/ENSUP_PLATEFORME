import React, { useEffect, useState } from 'react';
import { XCircle, Search } from 'lucide-react';
import { useUserContext } from '../../hooks/useUserContext';

type Departement = { id: number; nom: string };
type Section = { id: number; numero_section: string };
type User = { id: number; name: string; matricule: string };

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

  const handleSearchUser = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/users/search?q=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(await res.json());
    } catch (err) {
      console.error('Erreur recherche utilisateur', err);
    }
  };

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
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou matricule..."
            className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSearchUser}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Recherche privée
          </button>
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
                    checked={selectedDepartementIds.includes(dep.id.toString())}
                    onChange={() =>
                      toggleSelection(dep.id.toString(), selectedDepartementIds, setSelectedDepartementIds)
                    }
                  />
                  <span className="text-gray-800">{dep.nom}</span>
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
                    checked={selectedSectionIds.includes(sec.id.toString())}
                    onChange={() =>
                      toggleSelection(sec.id.toString(), selectedSectionIds, setSelectedSectionIds)
                    }
                  />
                  <span className="text-gray-800">Section {sec.numero_section}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/*  Utilisateurs privés */}
        {users.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Utilisateurs trouvés</h3>
            <div className="space-y-2">
              {users.map((u) => (
                <label key={u.matricule} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedMatricules.includes(u.matricule)}
                    onChange={() => toggleMatricule(u.matricule)}
                  />
                  <span>{u.name} ({u.matricule})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/*  Résumé des sélections */}
        <div className="mb-6 text-sm text-gray-700 space-y-2">
          {selectedDepartementIds.length > 0 && (
            <div>
              ✅ Départements sélectionnés :
              <ul className="list-disc ml-5">
                {selectedDepartementIds.map((id) => {
                  const dep = departements.find((d) => d.id.toString() === id);
                  return <li key={id}>{dep?.nom || 'Département'} (ID {id})</li>;
                })}
              </ul>
            </div>
          )}
          {selectedSectionIds.length > 0 && (
            <div>
              ✅ Sections sélectionnées :
              <ul className="list-disc ml-5">
                {selectedSectionIds.map((id) => {
                  const sec = sections.find((s) => s.id.toString() === id);
                  return <li key={id}>Section {sec?.numero_section || '???'} (ID {id})</li>;
                })}
              </ul>
            </div>
          )}
          {selectedMatricules.length > 0 && (
            <div>
              ✅ Utilisateurs sélectionnés :
              <ul className="list-disc ml-5">
                {selectedMatricules.map((mat) => {
                  const u = users.find((u) => u.matricule === mat);
                  return <li key={mat}>{u?.name || 'Utilisateur'} ({mat})</li>;
                })}
              </ul>
            </div>
            )} </div>

          <div className="flex justify-end space-x-4"> 
        <button onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" > 
          Annuler 
        </button>
        <button onClick={handleConfirm} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" > 
          Confirmer 
        </button> 
      </div> 
    </div> 
  </div> 
  ); 
};

export default DestinataireSelectorModal;
