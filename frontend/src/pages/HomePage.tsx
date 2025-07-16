// import React from 'react';

// // le hook pour gerrer les donnees essentiels 
// import { useUserContext } from '../hooks/useUserContext';
// // les composant generaux (de base et etudiant)
// import InstitutionBanner from '../components/InstitutionBanner';
// import NavigationButtons from '../components/NavigationButtons';
// import ServicesPanel from '../components/ServicesPanel';
// import StatusPanel from '../components/StatusPanel';
// import NewsCarousel from '../components/NewsCarousel';
// import EventsPanel from '../components/EventsPanel';
// import HeadlinesCarousel from '../components/HeadlinesCarousel';
// import Footer from '../components/Footer';
// // composants Admin
// // import CoursManager from '../components/Admin/CoursManager';
// // import FacturationPanel from '../components/Admin/FacturationPanel';
// // import GestionUtilisateurs from '../components/Admin/GestionUtilisateurs';
// // import InscriptionsPanel from '../components/Admin/InscriptionsPanel';
// // import SectionBuilder from '../components/Admin/SectionBuilder';
// // //composants Directeur
// // import AnnoncesGenerales from '../components/Directeur/AnnoncesGenerales';
// // import CalendrierAdmin from '../components/Directeur/CalendrierAdmin';
// // import PaiementsSuivi from '../components/Directeur/PaiementsSuivi';
// // import ProgrammeStats from '../components/Directeur/ProgrammeStats';
// // import StatistiquesGlobales from '../components/Directeur/StatistiquesGlobales';
// // //composants Enseignant
// // import AnnoncesEditor from '../components/Enseignant/AnnoncesEditor';
// // import Dashboard from '../components/Enseignant/Dashboard';
// // import DocumentsPanel from '../components/Enseignant/DocumentsPanel';
// // import MessagePanel from '../components/Enseignant/MessagePanel';
// // import PresenceRecorder from '../components/Enseignant/PresenceRecorder';
// // import RemisesPanel from '../components/Enseignant/RemisesPanel';

// type HomePageProps = {
//   onPageChange: (page: string) => void;
//   onServiceClick: (serviceName: string) => void;
//   onNavigateToMessages: () => void;
// };
//   // récupéré depuis l'URL


// export default function HomePage({
//   onPageChange,
//   onServiceClick,
//   onNavigateToMessages
// }: HomePageProps): JSX.Element {
//   const { role, slug } = useUserContext();

//   return (
//     <>
//       <InstitutionBanner slug={slug}/>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-4">
//             <NavigationButtons onPageChange={onPageChange} />
//             <ServicesPanel onServiceClick={onServiceClick} />
//           </div>
//           <div className="lg:col-span-8">
//             {role === 'etudiant' && (
//                 <>
//                   <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
//                   <NewsCarousel />
//                   <EventsPanel />
//                   <HeadlinesCarousel />
//                 </>
//               )}

//               {role === 'enseignant' && (
//                 <>
//                   <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
//                   <HeadlinesCarousel />
//                   <EventsPanel />
//                   {/* Tu peux remplacer NewsCarousel par un composant EnseignantActualités.tsx */}
//                 </>
//               )}

//               {role === 'directeur' && (
//                 <>
//                   <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
//                   <EventsPanel />
//                   <HeadlinesCarousel />
//                   {/* Tu peux ajouter un panneau StatistiquesPanel ici */}
//                 </>
//               )}

//               {role === 'administrateur' && (
//               <>
//                 <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
//                 <EventsPanel />
//                 <HeadlinesCarousel />
//                 {/* Tu peux ajouter ici un panneau AdminStatistiques.tsx */}
//                 {/* Ou AdminConsolePanel.tsx selon ce que tu veux montrer */}
//               </>
//             )}

//           </div>
//         </div>
//       </div>
//       <Footer onServiceClick={onServiceClick} />
//     </>
//   );
// }
