import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getFingerprint from './fingerprint';

type LoginResponse = {
  token?: string;
  matricule?: string;
  email?: string;
  nom?: string;
  role?: string;
  slug_etablissement?: string;
  require_2fa?: boolean;
  require_2fa_setup?: boolean;
  redirect_url?: string;
  error?: string;
};

export default function LoginForm(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // navigate(`/${slug}/`);
    }
  }, [navigate, slug]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const fingerprint = getFingerprint();

    try {
      const response = await fetch(`http://localhost:8000/api/${slug}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiant, mot_de_passe: password, fingerprint }),
      });

      const data: LoginResponse = await response.json();
      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('matricule', data.matricule || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('nom', data.nom || '');
        localStorage.setItem('role', data.role || '');
        localStorage.setItem('slug_etablissement', data.slug_etablissement || '');
        
        setTimeout(() => {
          navigate(`/${data.slug_etablissement}/`);
        }, 500);


      } else if (response.status === 202 && data.require_2fa_setup && data.redirect_url) {
        navigate(data.redirect_url);
      } else if (response.status === 202 && data.require_2fa) {
        navigate(`/${slug}/verify-2fa`, {
          state: { identifiant, fingerprint, slug },
        });
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
      setError('Erreur réseau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#0f4c3a] flex items-center justify-center px-4 pt-[2px] pb-[2px] overflow-hidden">
      <div className="w-full max-w-[400px] scale-[.81] origin-center bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden animate-fadeInUp">
        <div className="text-center px-8 pt-8 pb-4 border-b border-green-100">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-600 to-green-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse mb-6">
            <span className="text-4xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Connexion Sécurisée</h1>
          <p className="text-sm text-gray-500">
            Établissement : <span className="font-semibold text-green-600 uppercase">{slug}</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="px-8 py-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Identifiant</label>
            <div className="relative">
              <input
                type="text"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                placeholder="Entrez votre identifiant"
                required
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-220 bg-gray-50 text-base text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-80">👤</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-220 bg-gray-50 text-base text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-80">🔒</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg px-2 rounded-md opacity-60 hover:opacity-100 hover:bg-green-50 transition"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm font-medium">
              ⚠️ <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connexion en cours...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="bg-green-50 px-8 py-6 border-t border-green-100 text-center">
          <p className="text-sm text-gray-500 mb-3">Besoin d'aide pour vous connecter ?</p>
          <div className="flex justify-center flex-wrap gap-4 text-sm text-green-600 font-medium">
            <span
              onClick={() => navigate(`/${slug}/reset-password/request`)}
              className="cursor-pointer px-3 py-1 rounded hover:bg-green-100 hover:text-green-500 transition"
            >
              Mot de passe oublié
            </span>
            <span className="text-gray-300">•</span>
            <a href="#" className="px-3 py-1 rounded hover:bg-green-100 hover:text-green-500 transition">Support technique</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="px-3 py-1 rounded hover:bg-green-100 hover:text-green-500 transition">Guide utilisateur</a>
          </div>
        </div>
      </div>
    </div>
  );
}
