import React, { useState } from 'react';
import { User } from 'lucide-react';
import ColonneGaucheEns from './ColonneGaucheEns';
import ColonneCentraleEns from './ColonneCentraleEns';
import ColonneDroiteEns from './ColonneDroiteEns';

interface MoiPageProps {
  onPageChange?: (page: string) => void;
  onServiceClick?: (serviceName: string) => void;
}

const MoiPageEnseignant: React.FC<MoiPageProps> = ({ onPageChange, onServiceClick }) => {
  const [activeTab, setActiveTab] = useState('moi');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'nous' && onPageChange) {
      onPageChange('nous');
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau paysage */}
      <div className="relative mt-20 h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-teal-500"></div>
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
          <ColonneGaucheEns
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            onServiceClick={onServiceClick}
            onPageChange={onPageChange}
          />
          <ColonneCentraleEns />
          <ColonneDroiteEns
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
    </div>
  );
};

export default MoiPageEnseignant;
