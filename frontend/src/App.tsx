import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MoiPage from './components/MoiPage';
import NousPage from './components/NousPage';
import ServicePage from './components/ServicePage';
import PrivateRoute from './components/routes/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import Verify2FA from './components/auth/Verify2FA';
import QRCode2FA from './components/auth/QRcode2FA';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ResetPasswordRequest from './components/auth/ResetPasswordRequest';
import Header from './components/Header';

export default function App(): JSX.Element {
  const [currentService, setCurrentService] = useState<string>('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:slug/login" element={<LoginForm key="login" />} />
        <Route path="/:slug/2fa/init" element={<QRCode2FA key="qrcode2fa" />} />
        <Route path="/:slug/verify-2fa" element={<Verify2FA key="verify2fa" />} />
        <Route path="/:slug/reset-password/:token" element={<ResetPasswordForm key="resetform" />} />
        <Route path="/:slug/reset-password/request" element={<ResetPasswordRequest key="resetrequest" />} />
        <Route path="/not-found" element={<NotFoundPage />} />

        {/* Route privée pour page d'accueil */}
        <Route
          path="/:slug/"
          element={
            <PrivateRoute>
              <HomeWithNavigation setCurrentService={setCurrentService} />
            </PrivateRoute>
          }
        />

        {/* Route privée pour la page "Moi" */}
        <Route
          path="/:slug/moi"
          element={
            <PrivateRoute>
              <Header onNavigateHome={() => window.history.back()} />
              <MoiPage
                onPageChange={(page) => window.location.href = `/${getSlug()}/${page}`}
                onServiceClick={(name) => window.location.href = `/${getSlug()}/service/${name}`}
              />
            </PrivateRoute>
          }
        />

        {/* Route privée pour la page "Nous" */}
        <Route
          path="/:slug/nous"
          element={
            <PrivateRoute>
              <Header onNavigateHome={() => window.history.back()} />
              <NousPage />
            </PrivateRoute>
          }
        />

        {/* Route privée pour la page service */}
        <Route
          path="/:slug/service/:nom"
          element={
            <PrivateRoute>
              <Header onNavigateHome={() => window.history.back()} />
              <ServicePage serviceName={currentService} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

//  Composant intermédiaire pour gérer HomePage avec navigation
function HomeWithNavigation({ setCurrentService }: { setCurrentService: (s: string) => void }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  const handlePageChange = (page: string) => {
    navigate(`/${slug}/${page}`);
  };

  const handleServiceClick = (serviceName: string) => {
    setCurrentService(serviceName);
    navigate(`/${slug}/service/${serviceName}`);
  };

  const handleNavigateToMessages = () => {
    navigate(`/${slug}/nous`);
  };

  return (
    <>
      <Header onNavigateHome={() => navigate(`/${slug}/`)} />
      <HomePage
        key="homepage"
        onPageChange={handlePageChange}
        onServiceClick={handleServiceClick}
        onNavigateToMessages={handleNavigateToMessages}
      />
    </>
  );
}

//  Helper pour récupérer le slug
function getSlug(): string {
  const parts = window.location.pathname.split('/');
  return parts[1] || 'default-slug';
}
