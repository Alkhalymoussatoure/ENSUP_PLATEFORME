import React, { useState } from 'react';
import { Calendar, Filter, MapPin, Clock, Users } from 'lucide-react';

const EventsPanel = () => {
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: "Conférence sur l'Intelligence Artificielle",
      date: "25 Dec 2025",
      time: "14:00",
      location: "Amphithéâtre A",
      category: "moi",
      attendees: 150,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Soutenance de thèse - Informatique",
      date: "28 Dec 2025",
      time: "10:00",
      location: "Salle 201",
      category: "all",
      attendees: 45,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Réunion départementale - Sciences",
      date: "30 Dec 2025",
      time: "09:00",
      location: "Salle de réunion",
      category: "moi",
      attendees: 25,
      color: "bg-purple-500"
    }
  ];

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.category === filter
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Calendar className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Événements
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">Tous les événements</option>
            <option value="moi">Mes événements</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">
                  {event.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className={`p-1 rounded ${event.color} text-white`}>
                      <Calendar className="h-3 w-3" />
                    </div>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`p-1 rounded ${event.color} text-white`}>
                      <Clock className="h-3 w-3" />
                    </div>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`p-1 rounded ${event.color} text-white`}>
                      <MapPin className="h-3 w-3" />
                    </div>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.color} text-white`}>
                  {event.category === 'moi' ? 'Personnel' : 'Général'}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{event.attendees} participants</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button className={`px-3 py-1 rounded-lg ${event.color} text-white text-sm hover:opacity-90 transition-opacity duration-200`}>
                  Participer
                </button>
                <button className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors duration-200">
                  Détails
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Dans 3 jours
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPanel;