import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Film, Monitor, Leaf, Globe } from 'lucide-react';

const HeadlinesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const headlines = [
    {
      id: 1,
      title: "Nouveau record d'inscription universitaire",
      description: "Les universités guinéennes enregistrent une hausse de 25% des inscriptions cette année.",
      category: "Grands titres",
      icon: TrendingUp,
      color: "bg-red-600",
      stats: "+25%"
    },
    {
      id: 2,
      title: "Festival du cinéma africain 2025",
      description: "Le plus grand festival du cinéma africain débute la semaine prochaine à Conakry.",
      category: "Cinéma",
      icon: Film,
      color: "bg-purple-600",
      stats: "100+ films"
    },
    {
      id: 3,
      title: "Sommet technologique révolutionnaire",
      description: "Les leaders tech mondiaux se réunissent pour discuter de l'avenir du numérique en Afrique.",
      category: "Informatique",
      icon: Monitor,
      color: "bg-blue-600",
      stats: "50+ pays"
    },
    {
      id: 4,
      title: "Initiative environnementale majeure",
      description: "Lancement d'un programme de reforestation dans toutes les universités guinéennes.",
      category: "Environnement",
      icon: Leaf,
      color: "bg-green-600",
      stats: "10,000 arbres"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % headlines.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % headlines.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + headlines.length) % headlines.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Globe className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Manchettes
        </h3>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {headlines.map((item) => (
              <div key={item.id} className="w-full flex-shrink-0">
                <div className={`${item.color} text-white rounded-lg p-6`}>
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <div className="bg-white/20 px-2 py-1 rounded-full">
                          <span className="text-sm font-bold">{item.stats}</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold mb-3">
                        {item.title}
                      </h4>
                      <p className="text-white/90 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                        Lire l'article
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {headlines.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-emerald-600 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeadlinesCarousel;