import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ResetPasswordForm.css';

type ResetRequestResponse = {
  message?: string;
  error?: string;
};

export default function ResetPasswordRequest(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8000/api/${slug}/reset-password/request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data: ResetRequestResponse = await res.json();
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
        <h2 className="login-title">Réinitialisation du mot de passe</h2>
        <form onSubmit={handleRequest} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            required
            className="form-input"
          />
          <button type="submit" className="login-button">Recevoir le lien</button>
        </form>

        {message && <div className="reset-message success">✅ {message}</div>}
        {error && <div className="reset-message error">⚠️ {error}</div>}
      </div>
    </div>
  );
}
