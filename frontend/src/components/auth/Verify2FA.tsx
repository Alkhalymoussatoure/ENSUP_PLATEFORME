import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = {
  identifiant: string;
  fingerprint: string;
  slug: string;
};

export default function Verify2FA(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!state || !state.identifiant || !state.slug || !state.fingerprint) {
      navigate('/');
    }
  }, [state, navigate]);

  const { identifiant, fingerprint, slug } = state || {};

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/api/${slug}/2fa/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiant, fingerprint, code }),
      });

      const data: {
        token?: string;
        error?: string;
        role?: string;
        nom?: string;
        email?: string;
        matricule?: string;
        slug_etablissement?: string;
      } = await response.json();

      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || '');
        localStorage.setItem('nom', data.nom || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('matricule', data.matricule || '');
        localStorage.setItem('slug_etablissement', data.slug_etablissement || slug || '');
        navigate(`/${data.slug_etablissement || slug}/`);
      } else {
        setError(data.error || 'Erreur de vérification');
      }
    } catch {
      setError('Erreur réseau');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Vérifie ton code 2FA</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code à 6 chiffres"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Vérifier
          </button>
        </form>
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
