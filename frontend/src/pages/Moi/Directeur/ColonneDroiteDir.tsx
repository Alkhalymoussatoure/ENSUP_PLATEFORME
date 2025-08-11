import React from 'react';

interface Day {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface ColonneDroiteDirProps {
  currentDate: Date;
  selectedDate: number | null;
  setSelectedDate: (date: number | null) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  monthNames: string[];
  dayNames: string[];
  getDaysInMonth: () => Day[];
}

const ColonneDroiteDir: React.FC<ColonneDroiteDirProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  navigateMonth,
  monthNames,
  dayNames,
  getDaysInMonth
}) => {
  const days = getDaysInMonth();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigateMonth('prev')} className="text-sm text-gray-600 hover:text-black">
          ◀
        </button>
        <h2 className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={() => navigateMonth('next')} className="text-sm text-gray-600 hover:text-black">
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {dayNames.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-2 rounded cursor-pointer ${
              day.isCurrentMonth ? 'text-black' : 'text-gray-300'
            } ${day.isToday ? 'bg-blue-100 font-bold' : ''} ${
              selectedDate === day.date && day.isCurrentMonth ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColonneDroiteDir;
