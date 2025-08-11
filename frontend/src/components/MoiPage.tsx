import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  Award, 
  Globe, 
  Briefcase,
  Settings,
  Info
} from 'lucide-react';

interface MoiPageProps {
  onPageChange?: (page: string) => void;
  onServiceClick?: (serviceName: string) => void;
}

const MoiPage: React.FC<MoiPageProps> = ({ onPageChange, onServiceClick }) => {
  const [activeTab, setActiveTab] = useState('moi');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'nous' && onPageChange) {
      onPageChange('nous');
    }
  };

  // Fonction pour naviguer dans le calendrier
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  // Fonction pour obtenir les jours du mois
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Jours du mois actuel
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.getFullYear() && 
                     month === today.getMonth() && 
                     day === today.getDate();
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const courses = [
    {
      id: 1,
      name: "Mathématiques Avancées",
      code: "MATH-301",
      professor: "Dr. Camara",
      color: "bg-orange-500",
      documents: { total: 12, new: 3 },
      assignments: { total: 5, pending: 2 },
      grade: "16/20",
      finalGrade: "15/20",
      classMedian: "14/20",
      classAverage: "13.5/20",
      absences: "2h",
      forumActive: true
    },
    {
      id: 2,
      name: "Informatique Théorique",
      code: "INFO-205",
      professor: "Prof. Diallo",
      color: "bg-green-500",
      documents: { total: 8, new: 1 },
      assignments: { total: 3, pending: 0 },
      grade: "18/20",
      finalGrade: "17/20",
      classMedian: "15/20",
      classAverage: "14.8/20",
      absences: "0h",
      forumActive: false
    },
    {
      id: 3,
      name: "Physique Quantique",
      code: "PHYS-401",
      professor: "Dr. Bah",
      color: "bg-purple-500",
      documents: { total: 15, new: 5 },
      assignments: { total: 4, pending: 1 },
      grade: "14/20",
      finalGrade: "14/20",
      classMedian: "13/20",
      classAverage: "12.9/20",
      absences: "4h",
      forumActive: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section paysage sans nom */}
      <div className="relative mt-20 h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-end">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne gauche - 1/3 */}
          <div className="lg:col-span-3">
            {/* Boutons Moi/Nous */}
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={() => handleTabChange('moi')}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                  activeTab === 'moi' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <User className="h-6 w-6" />
                  <span className="font-medium">Moi</span>
                </div>
              </button>
              <button 
                onClick={() => handleTabChange('nous')}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                  activeTab === 'nous' 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span className="font-medium">Nous</span>
                </div>
              </button>
            </div>

            {/* Mes Classes */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Mes Classes</h3>
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900">MATH-301</h4>
                <p className="text-sm text-gray-600">Mathématiques Avancées</p>
              </div>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => onServiceClick && onServiceClick('calendrier')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Calendrier</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('documents-cours')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <FileText className="h-4 w-4" />
                  <span>Documents de cours</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('forum-classe')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Forum de classe</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('infos-enseignant')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Infos sur l'enseignant</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('liste-absences')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <Clock className="h-4 w-4" />
                  <span>Liste de mes absences</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('notes-evaluation')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <Award className="h-4 w-4" />
                  <span>Notes d'évaluation</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('sites-recommandes')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <Globe className="h-4 w-4" />
                  <span>Sites web recommandés</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('travaux')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Travaux</span>
                </button>
              </div>
            </div>

            {/* Mes Services */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Mes Services</h3>
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Settings className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => onServiceClick && onServiceClick('calendrier-personnel')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 p-2 rounded hover:bg-emerald-50"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Calendrier</span>
                </button>
                <button 
                  onClick={() => onServiceClick && onServiceClick('forum-equipe')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 p-2 rounded hover:bg-emerald-50"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Forum par équipe</span>
                </button>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Plus large */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Activité dans mes classes</h3>
              
              <div className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-4 h-4 rounded-full ${course.color}`}></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.code}</h4>
                        <p className="text-sm text-gray-600">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.professor}</p>
                      </div>
                    </div>

                    {/* Documents et vidéos */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Documents et vidéos</span>
                        </div>
                        <div className="flex space-x-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {course.documents.total - course.documents.new} distribués
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {course.documents.new} nouveaux
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Travaux */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Travaux</span>
                        </div>
                        <div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {course.assignments.total} énoncés distribués
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes d'évaluations */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Notes d'évaluations</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Votre note actuelle: </span>
                          <span className="font-semibold">{course.grade}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Note finale transmise: </span>
                          <span className="font-semibold">{course.finalGrade}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Médiane de la classe: </span>
                          <span className="font-semibold">{course.classMedian}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Moyenne de la classe: </span>
                          <span className="font-semibold">{course.classAverage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Retards et absences */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Retards et absences</span>
                        </div>
                        <span className="text-sm font-semibold">{course.absences}</span>
                      </div>
                    </div>

                    {/* Forum de classe */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Forum de classe</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.forumActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.forumActive ? 'Actif' : 'Non actif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite - 1/3 */}
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
              
              {/* Navigation du calendrier */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h4 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1">
                {/* En-têtes des jours */}
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50 rounded">
                    {day}
                  </div>
                ))}
                
                {/* Jours du calendrier */}
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
                <div className="p-2 bg-purple-100 rounded-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Aujourd'hui</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Sélectionné</span>
                  </div>
                </div>
              </div>
              
              {/* Événements du jour sélectionné */}
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
          
        </div>
      </div>
    </div>
  );
};

export default MoiPage;