import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ResetPasswordForm.css';

type ResetResponse = {
  message?: string;
  error?: string;
};

export default function ResetPasswordForm(): JSX.Element {
  const { slug, token } = useParams<{ slug: string; token: string }>();

  const [motDePasse, setMotDePasse] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleReset = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/reset-password/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mot_de_passe: motDePasse,
          mot_de_passe_confirm: confirmation,
        }),
      });

      const data: ResetResponse = await res.json();
      if (res.status === 200 && data.message) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch {
      setError('Erreur réseau');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Créer un nouveau mot de passe</h2>
        <form onSubmit={handleReset} className="login-form">
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Nouveau mot de passe"
            required
            className="form-input"
          />
          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Confirmer le mot de passe"
            required
            className="form-input"
          />
          <button type="submit" className="login-button">Valider</button>
        </form>

        {message && <div className="reset-message success">✅ {message}</div>}
        {error && <div className="reset-message error">⚠️ {error}</div>}
      </div>
    </div>
  );
}
