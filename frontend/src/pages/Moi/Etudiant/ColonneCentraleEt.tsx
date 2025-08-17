import React from 'react';
import {
  FileText, Briefcase, Award, Clock, MessageSquare
} from 'lucide-react';

interface Course {
  id: number;
  nom: string;
  code: string;
  enseignant: string;
  coleur: string;
  documents: { total: number; new: number };
  travaux: { total: number; pending: number };
  note: string;
  noteFinale: string;
  medianeClasse: string;
  moyenneClasse: string;
  absences: string;
  forumActive: boolean;
}

const courses: Course[] = [
  {
    id: 1,
    nom: "Mathématiques Avancées",
    code: "MATH-301",
    enseignant: "Dr. Camara",
    coleur: "bg-orange-500",
    documents: { total: 12, new: 3 },
    travaux: { total: 5, pending: 2 },
    note: "16/20",
    noteFinale: "15/20",
    medianeClasse: "14/20",
    moyenneClasse: "13.5/20",
    absences: "2h",
    forumActive: true
  },
  {
    id: 2,
    nom: "Informatique Théorique",
    code: "INFO-205",
    enseignant: "Prof. Diallo",
    coleur: "bg-green-500",
    documents: { total: 8, new: 1 },
    travaux: { total: 3, pending: 0 },
    note: "18/20",
    noteFinale: "17/20",
    medianeClasse: "15/20",
    moyenneClasse: "14.8/20",
    absences: "0h",
    forumActive: false
  },
  {
    id: 3,
    nom: "Physique Quantique",
    code: "PHYS-401",
    enseignant: "Dr. Bah",
    coleur: "bg-purple-500",
    documents: { total: 15, new: 5 },
    travaux: { total: 4, pending: 1 },
    note: "14/20",
    noteFinale: "14/20",
    medianeClasse: "13/20",
    moyenneClasse: "12.9/20",
    absences: "4h",
    forumActive: true
  }
];

const ColonneCentraleEt: React.FC = () => {
  return (
    <div className="lg:col-span-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Activité dans mes classes</h3>
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-4 h-4 rounded-full ${course.coleur}`}></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{course.code}</h4>
                  <p className="text-sm text-gray-600">{course.nom}</p>
                  <p className="text-xs text-gray-500">{course.enseignant}</p>
                </div>
              </div>

              {/* Documents */}
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
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {course.travaux.total} énoncés distribués
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Notes d'évaluations</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><span className="text-gray-600">Votre note actuelle: </span><span className="font-semibold">{course.note}</span></div>
                  <div><span className="text-gray-600">Note finale transmise: </span><span className="font-semibold">{course.noteFinale}</span></div>
                  <div><span className="text-gray-600">Médiane de la classe: </span><span className="font-semibold">{course.medianeClasse}</span></div>
                  <div><span className="text-gray-600">Moyenne de la classe: </span><span className="font-semibold">{course.moyenneClasse}</span></div>
                </div>
              </div>

              {/* Absences */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Retards et absences</span>
                  </div>
                  <span className="text-sm font-semibold">{course.absences}</span>
                </div>
              </div>

              {/* Forum */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Forum de classe</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  course.forumActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.forumActive ? 'Actif' : 'Non actif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColonneCentraleEt;
