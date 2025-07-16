import React from 'react';
import { 
  Users, 
  CreditCard, 
  FileText, 
  Calendar, 
  BarChart, 
  Clock, 
  Award, 
  Building, 
  BookOpen,
  Globe,
  Shield
} from 'lucide-react';

interface ServicePageProps {
  serviceName: string;
}

const ServicePage: React.FC<ServicePageProps> = ({ serviceName }) => {
  const getServiceInfo = (key: string) => {
    const services = {
      'annuaire-enseignants': {
        title: 'Annuaire des enseignants',
        icon: Users,
        color: 'bg-blue-500',
        description: 'Consultez les informations de contact et les profils de tous les enseignants de l\'établissement.'
      },
      'forfait-etudiant': {
        title: 'Forfait étudiant',
        icon: CreditCard,
        color: 'bg-green-500',
        description: 'Gérez vos paiements, consultez vos factures et suivez l\'état de vos frais de scolarité.'
      },
      'dossier-personnel': {
        title: 'Dossier personnel',
        icon: FileText,
        color: 'bg-purple-500',
        description: 'Accédez à votre dossier académique complet, vos informations personnelles et vos documents officiels.'
      },
      'frequentation-scolaire': {
        title: 'Fréquentation scolaire',
        icon: Calendar,
        color: 'bg-orange-500',
        description: 'Consultez votre historique de présence, vos absences et votre taux de fréquentation.'
      },
      'grille-cheminement': {
        title: 'Grille de cheminement',
        icon: BarChart,
        color: 'bg-red-500',
        description: 'Visualisez votre parcours académique, les cours complétés et ceux à venir.'
      },
      'horaire-cours': {
        title: 'Horaire de cours',
        icon: Clock,
        color: 'bg-indigo-500',
        description: 'Consultez votre emploi du temps, les salles de cours et les horaires des enseignants.'
      },
      'resultats-bulletin': {
        title: 'Résultats - Bulletin d\'études',
        icon: Award,
        color: 'bg-yellow-500',
        description: 'Accédez à vos notes, bulletins et relevés de notes officiels.'
      },
      'stages': {
        title: 'Stages',
        icon: Building,
        color: 'bg-teal-500',
        description: 'Trouvez des opportunités de stage, gérez vos candidatures et suivez vos stages en cours.'
      },
      'documents-ligne': {
        title: 'Documents en ligne',
        icon: FileText,
        color: 'bg-blue-500',
        description: 'Accédez à tous vos documents académiques, formulaires et ressources pédagogiques.'
      },
      'bibliotheque-numerique': {
        title: 'Bibliothèque numérique',
        icon: BookOpen,
        color: 'bg-green-500',
        description: 'Explorez notre collection numérique de livres, articles et ressources de recherche.'
      },
      'calendrier': {
        title: 'Calendrier',
        icon: Calendar,
        color: 'bg-purple-500',
        description: 'Consultez votre calendrier personnel, vos cours et événements importants.'
      },
      'documents-cours': {
        title: 'Documents de cours',
        icon: FileText,
        color: 'bg-blue-500',
        description: 'Accédez à tous les documents, supports de cours et ressources pédagogiques.'
      },
      'forum-classe': {
        title: 'Forum de classe',
        icon: Users,
        color: 'bg-green-500',
        description: 'Participez aux discussions de classe et échangez avec vos camarades.'
      },
      'infos-enseignant': {
        title: 'Infos sur l\'enseignant',
        icon: Users,
        color: 'bg-indigo-500',
        description: 'Consultez les informations de contact et les horaires de vos enseignants.'
      },
      'liste-absences': {
        title: 'Liste de mes absences',
        icon: Clock,
        color: 'bg-orange-500',
        description: 'Consultez votre historique d\'absences et de retards.'
      },
      'notes-evaluation': {
        title: 'Notes d\'évaluation',
        icon: Award,
        color: 'bg-yellow-500',
        description: 'Accédez à toutes vos notes, évaluations et bulletins.'
      },
      'sites-recommandes': {
        title: 'Sites web recommandés',
        icon: Globe,
        color: 'bg-teal-500',
        description: 'Découvrez les sites web et ressources recommandés par vos enseignants.'
      },
      'travaux': {
        title: 'Travaux',
        icon: FileText,
        color: 'bg-red-500',
        description: 'Consultez vos devoirs, projets et travaux à rendre.'
      },
      'calendrier-personnel': {
        title: 'Calendrier personnel',
        icon: Calendar,
        color: 'bg-emerald-500',
        description: 'Gérez votre calendrier personnel et vos événements privés.'
      },
      'forum-equipe': {
        title: 'Forum par équipe',
        icon: Users,
        color: 'bg-emerald-600',
        description: 'Collaborez avec votre équipe et participez aux discussions de groupe.'
      },
      'solde-payer': {
        title: 'Solde à payer',
        icon: CreditCard,
        color: 'bg-red-500',
        description: 'Consultez votre solde à payer, gérez vos paiements et suivez l\'état de vos frais de scolarité.'
      },
      'documents-diffuses': {
        title: 'Documents diffusés',
        icon: FileText,
        color: 'bg-emerald-500',
        description: 'Accédez à tous les documents récemment diffusés par l\'administration et vos enseignants.'
      },
      'a-propos-kharagni': {
        title: 'À propos de Kharagni fée',
        icon: FileText,
        color: 'bg-emerald-600',
        description: 'Découvrez l\'histoire, la mission et les valeurs de la plateforme éducative Kharagni fée.'
      },
      'securite-paiement': {
        title: 'Sécurité et Paiement',
        icon: Shield,
        color: 'bg-blue-600',
        description: 'Informations sur la sécurité de vos données et les modalités de paiement sécurisées.'
      },
      'conditions-utilisation': {
        title: 'Conditions d\'utilisation',
        icon: CreditCard,
        color: 'bg-purple-600',
        description: 'Consultez les termes et conditions d\'utilisation de la plateforme Kharagni fée.'
      }
    };

    return services[key as keyof typeof services] || {
      title: 'Service',
      icon: Globe,
      color: 'bg-gray-500',
      description: 'Service en cours de développement.'
    };
  };

  const service = getServiceInfo(serviceName);
  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section horizontale avec le titre du service */}
      <div className="relative mt-20 h-32 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${service.color.replace('bg-', 'from-')}-400 ${service.color.replace('bg-', 'to-')}-600`}></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <IconComponent className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">{service.title}</h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="text-center">
            <div className={`inline-flex p-6 rounded-full ${service.color} text-white mb-6`}>
              <IconComponent className="h-16 w-16" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {service.title}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {service.description}
            </p>
            
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-8 border border-emerald-200">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Service en cours de développement
              </h3>
              
              <p className="text-gray-600 mb-6">
                Cette fonctionnalité sera bientôt disponible. Notre équipe travaille activement 
                pour vous offrir la meilleure expérience possible.
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Plateforme Kharangni fée</span>
                </div>
                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Version 2025.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;