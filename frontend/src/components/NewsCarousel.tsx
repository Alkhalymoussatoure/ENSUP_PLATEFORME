import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Calendar, BookOpen, Zap } from 'lucide-react';

const NewsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const news = [
    {
      id: 1,
      title: "Nouvelle réforme éducative 2025",
      description: "Le ministère de l'éducation annonce de nouvelles mesures pour transformer l'enseignement supérieur en Guinée.",
      category: "Ministère",
      icon: BookOpen,
      color: "bg-blue-600"
    },
    {
      id: 2,
      title: "Sensibilisation contre les violences",
      description: "Campagne nationale de sensibilisation contre les violences en milieu scolaire. Formation obligatoire pour tous.",
      category: "Sécurité",
      icon: AlertTriangle,
      color: "bg-red-600"
    },
    {
      id: 3,
      title: "Congés de fin d'année",
      description: "Les vacances de fin d'année commenceront le 20 décembre. Reprise des cours le 8 janvier 2025.",
      category: "Calendrier",
      icon: Calendar,
      color: "bg-green-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [news.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Zap className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Actualités
        </h3>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {news.map((item) => (
              <div key={item.id} className="w-full flex-shrink-0">
                <div className={`${item.color} text-white rounded-lg p-6`}>
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <h4 className="text-lg font-bold mt-2 mb-3">
                        {item.title}
                      </h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.description}
                      </p>
                      <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                        Lire plus
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
        {news.map((_, index) => (
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

export default NewsCarousel;