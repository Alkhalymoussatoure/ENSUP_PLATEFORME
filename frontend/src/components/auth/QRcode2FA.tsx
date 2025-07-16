import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import getFingerprint from './fingerprint';

export default function QRCode2FA(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const identifiant = searchParams.get('identifiant');
  const navigate = useNavigate();
  
  const [qrCode, setQrCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchQRCode(): Promise<void> {
      try {
        const response = await fetch(
          `http://localhost:8000/api/${slug}/2fa/generer?identifiant=${identifiant}`
        );
        const data: { qr_code?: string; error?: string } = await response.json();

        if (response.ok && data.qr_code) {
          setQrCode(data.qr_code);
        } else {
          setError(data.error || 'Erreur de génération');
        }
      } catch {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    }

    fetchQRCode();
  }, [slug, identifiant]);

  const handleScanConfirmed = (): void => {
    const fingerprint = getFingerprint();
    navigate(`/${slug}/verify-2fa`, {
      state: { identifiant, slug, fingerprint }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Configuration 2FA</h2>
        {loading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            <p className="text-gray-600">Chargement du QR Code…</p>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <img src={qrCode} alt="QR Code 2FA" className="mx-auto mb-4" />
            <p className="text-gray-700 mb-2">
              Scanne ce QR avec <strong>Google Authenticator</strong> ou une application compatible
            </p>
            <button
              onClick={handleScanConfirmed}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              J&apos;ai scanné le QR Code
            </button>
          </>
        )}
      </div>
    </div>
  );
}
