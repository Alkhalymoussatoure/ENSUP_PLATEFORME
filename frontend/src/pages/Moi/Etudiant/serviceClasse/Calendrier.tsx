import React, { useEffect, useState } from 'react';
import {
  CalendarPlus, Filter, List, LayoutGrid,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useUserContext } from '../../../../hooks/useUserContext';

export interface Evenement {
  id: number;
  titre: string;
  description: string;
  heure_debut: string;
  heure_fin: string;
  type_evenement: string;
  est_public: boolean;
  cree_par: string | null;
  lieu: string;
  participants: string[];
}

const TYPES = ['cours', 'examen', 'reunion', 'conference', 'vacances'];

const Calendrier = () => {
  const { slug, token } = useUserContext();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mois' | 'liste'>('mois');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [evenements, setEvenements] = useState<Evenement[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/${slug}/evenements/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setEvenements(data))
      .catch(err => console.error('Erreur chargement événements:', err));
  }, [slug, token]);

  const filteredEvents = selectedType
    ? evenements.filter((e) => e.type_evenement === selectedType)
    : evenements;

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Dimanche

    const days = [];

    // Jours du mois précédent (vides)
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null });
    }

    // Jours du mois courant
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const isToday = dateObj.toDateString() === new Date().toDateString();

      const hasEvent = evenements.some((e) => {
        const eventDate = new Date(e.heure_debut);
        return (
          eventDate.getFullYear() === year &&
          eventDate.getMonth() === month &&
          eventDate.getDate() === day
        );
      });

      days.push({ date: day, isToday, hasEvent });
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Titre principal */}
      <h2 className="text-2xl font-bold text-center text-gray-800">Calendrier sommaire</h2>

      {/* Instructions + bouton ajout */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="text-sm text-gray-700 mb-2">
          Voici le calendrier général qui inclut tous les évènements entrés par vos enseignants.
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Pour ajouter des évènements privés au calendrier, utilisez le lien <strong>"Ajouter un évènement"</strong> ou appuyez sur l'une des dates pour ajouter un évènement à cette date.
        </p>
        <button
          onClick={() => console.log('Ouvrir popup ajout')}
          className="inline-flex items-center space-x-2 text-purple-700 hover:underline mt-2"
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Ajouter un évènement</span>
        </button>
      </div>

      {/* Choix du format */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('mois')}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${viewMode === 'mois' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Mois</span>
          </button>
          <button
            onClick={() => setViewMode('liste')}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${viewMode === 'liste' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            <List className="h-4 w-4" />
            <span>Liste</span>
          </button>
        </div>

        {/* Filtre par type */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">Tous les types</option>
            {TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendrier ou liste */}
      {viewMode === 'mois' ? (
        <div>
          {/* Pagination mois */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => handleMonthChange('prev')} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
            </h4>
            <button onClick={() => handleMonthChange('next')} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
              <div key={d} className="font-semibold text-gray-600">{d}</div>
            ))}
            {getDaysInMonth().map((day, index) => (
              <div
                key={index}
                className={`h-10 w-10 flex items-center justify-center rounded-full mx-auto
                  ${day.date === null ? 'text-gray-300' : ''}
                  ${day.isToday ? 'bg-orange-300 text-white font-bold' : ''}
                  ${day.hasEvent ? 'bg-yellow-300 text-gray-800 font-semibold' : ''}
                  ${!day.isToday && !day.hasEvent && day.date ? 'hover:bg-purple-100 cursor-pointer' : ''}
                `}
              >
                {day.date || ''}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((e) => (
            <div key={e.id} className="border p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800">{e.titre}</h4>
              <p className="text-sm text-gray-600">{e.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(e.heure_debut).toLocaleString()} → {new Date(e.heure_fin).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Lieu : {e.lieu}</p>
              <p className="text-xs text-gray-500">Type : {e.type_evenement}</p>
            </div>
          ))}
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 text-xs text-gray-600 space-y-1">
        <div><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span> Jour avec événement</div>
        <div><span className="inline-block w-3 h-3 bg-orange-300 rounded-full mr-2"></span> Aujourd’hui</div>
      </div>
    </div>
  );
};

export default Calendrier;
