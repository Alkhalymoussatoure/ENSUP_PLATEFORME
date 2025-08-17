import React, { useState } from 'react';
import { User } from 'lucide-react';
import ColonneGaucheEt from './ColonneGaucheEt';
import ColonneCentraleEt from './ColonneCentraleEt';
import ColonneDroiteEt from './ColonneDroiteEt';

import Calendrier from './serviceClasse/Calendrier';
import Document_pedagogiques from './serviceClasse/Document_pedagogiques';
import Forum_etudiant from './serviceClasse/Forum_etudiant';
import Information_enseignant from './serviceClasse/Information_enseignant';
import NoteEvaluation from './serviceClasse/NoteEvaluation';
import Presence_absences from './serviceClasse/Presence_absences';
import Site_web_recommender from './serviceClasse/Site_web_recommender';
import Travaux_a_remettre from './serviceClasse/Travaux_a_remettre';
import CalendrierPersonnel from './serviceClasse/CalendrierPersonnel';
import ForumEquipe from './serviceClasse/ForumEquipe';

interface MoiPageProps {
  onPageChange?: (page: string) => void;
}

const MoiPageEtudiant: React.FC<MoiPageProps> = ({ onPageChange }) => {
  const [activeTab, setActiveTab] = useState('moi');
  const [activeService, setActiveService] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'nous' && onPageChange) {
      onPageChange('nous');
    }
  };

  const handleServiceClick = (serviceName: string) => {
    setActiveService(serviceName);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
    setSelectedDate(null);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate.getDate(), isCurrentMonth: false, isToday: false });
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.getFullYear() &&
                      month === today.getMonth() &&
                      day === today.getDate();
      days.push({ date: day, isCurrentMonth: true, isToday });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: day, isCurrentMonth: false, isToday: false });
    }

    return days;
  };

  const renderService = () => {
    const serviceComponent = (() => {
      switch (activeService) {
        case 'calendrier': return <Calendrier />;
        case 'documents-cours': return <Document_pedagogiques />;
        case 'forum-classe': return <Forum_etudiant />;
        case 'infos-enseignant': return <Information_enseignant />;
        case 'notes-evaluation': return <NoteEvaluation />;
        case 'liste-absences': return <Presence_absences />;
        case 'sites-recommandes': return <Site_web_recommender />;
        case 'travaux': return <Travaux_a_remettre />;
        case 'forum-equipe': return <ForumEquipe />;
        case 'calendrier-personnel': return <CalendrierPersonnel />;
        default: return <ColonneCentraleEt />;
      }
    })();

    return (
      <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
        <div className="lg:col-span-6">
          {serviceComponent}
        </div>
        <div className="lg:col-span-3">
          <ColonneDroiteEt
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            navigateMonth={navigateMonth}
            monthNames={monthNames}
            dayNames={dayNames}
            getDaysInMonth={getDaysInMonth}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau paysage */}
      <div className="relative mt-20 h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-end">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ColonneGaucheEt
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            onServiceClick={handleServiceClick}
            onPageChange={onPageChange}
          />
          <div className="lg:col-span-9">
            {renderService()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoiPageEtudiant;
