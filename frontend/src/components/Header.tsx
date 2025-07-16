import React, { useState, useEffect } from 'react';
import { MessageCircle, LogOut, User, GraduationCap, Bell } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// recuperation des donnees suivant les roles 
import { useUserContext } from '../hooks/useUserContext';
// fin appelle

interface HeaderProps {
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { nom, role } = useUserContext(); // ici recuperation de nom et role utilisateur 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
// fonction pour la deconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8000/api/${slug}/logout/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    } finally {
      localStorage.clear(); //  Nettoyage
      navigate(`/${slug}/login`); //  Redirection
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-lg shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button 
            onClick={onNavigateHome}
            className="flex items-center space-x-4 group cursor-pointer"
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-3 rounded-xl transform group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="relative">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                Kharangni fée
              </h1>
            </div>
          </button>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                {/* <span className="text-sm font-medium text-gray-800">Mamadou Diallo</span>
                <div className="text-xs text-gray-500">Étudiant actif</div> */}
                <span className="text-sm font-medium text-gray-800">{nom || 'Utilisateur'}</span>
                <div className="text-xs text-gray-500">
                  {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} actif` : 'Role inconnu'}
                </div>

              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="relative p-3 text-gray-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-all duration-200 group shadow-sm">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  5
                </span>
              </button>

              <button className="relative p-3 text-gray-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-all duration-200 group shadow-sm">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  3
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="p-3 text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl transition-all duration-200 group shadow-sm"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
