import React from 'react';
import { Calendar, Users, Info } from 'lucide-react';

interface Day {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface Props {
  currentDate: Date;
  selectedDate: number | null;
  setSelectedDate: (date: number | null) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  monthNames: string[];
  dayNames: string[];
  getDaysInMonth: () => Day[];
}

const ColonneDroiteEt: React.FC<Props> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  navigateMonth,
  monthNames,
  dayNames,
  getDaysInMonth
}) => {
  return (
    <div className="lg:col-span-3">
      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-800">Calendrier</h3>
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50 rounded">
              {day}
            </div>
          ))}
          {getDaysInMonth().map((day, index) => (
            <button
              key={index}
              onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
              className={`p-2 text-center text-sm rounded transition-all duration-200 ${
                !day.isCurrentMonth
                  ? 'text-gray-300 cursor-not-allowed'
                  : day.isToday
                  ? 'bg-blue-500 text-white font-bold shadow-md'
                  : selectedDate === day.date
                  ? 'bg-purple-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-purple-100 hover:text-purple-700'
              }`}
              disabled={!day.isCurrentMonth}
            >
              {day.date}
            </button>
          ))}
        </div>

        {/* Légende */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
          <div className="p-2 bg-purple-100 rounded-full flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Aujourd'hui</span>
          </div>
          <div className="p-2 bg-purple-100 rounded-full flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Sélectionné</span>
          </div>
        </div>

        {/* Événements */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h5 className="font-semibold text-purple-800 mb-2">
              Événements du {selectedDate} {monthNames[currentDate.getMonth()]}
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cours de Mathématiques - 14h00</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>TP Informatique - 16h30</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nous */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Nous</h3>
          <div className="p-2 bg-emerald-100 rounded-full">
            <Users className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Messagerie interne pour les établissements. Communiquez facilement avec vos collègues et enseignants.
        </p>
      </div>

      {/* Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Information</h3>
          <div className="p-2 bg-blue-100 rounded-full">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          La page "Moi" est votre espace personnel de support de cours. Accédez à tous vos documents, notes et activités académiques.
        </p>
      </div>
    </div>
  );
};

export default ColonneDroiteEt;
