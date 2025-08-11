import React from 'react';

interface Day {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface ColonneDroiteEnsProps {
  currentDate: Date;
  selectedDate: number | null;
  setSelectedDate: (date: number | null) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  monthNames: string[];
  dayNames: string[];
  getDaysInMonth: () => Day[];
}

const ColonneDroiteEns: React.FC<ColonneDroiteEnsProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  navigateMonth,
  monthNames,
  dayNames,
  getDaysInMonth
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getDaysInMonth();

  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
          {dayNames.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {days.map((day, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg ${
                day.isCurrentMonth
                  ? day.isToday
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : selectedDate === day.date
                    ? 'bg-blue-200 text-blue-800'
                    : 'text-gray-800 hover:bg-gray-100'
                  : 'text-gray-400'
              }`}
              onClick={() =>
                day.isCurrentMonth ? setSelectedDate(day.date) : null
              }
            >
              {day.date}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColonneDroiteEns;
