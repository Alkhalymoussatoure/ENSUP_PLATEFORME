import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { HomeDispatcher } from './pages/home';
import NotFoundPage from './pages/NotFoundPage';
import NousPage from './components/NousPage';
import ServicePage from './components/ServicePage';
import PrivateRoute from './components/routes/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import Verify2FA from './components/auth/Verify2FA';
import QRCode2FA from './components/auth/QRcode2FA';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ResetPasswordRequest from './components/auth/ResetPasswordRequest';
import Header from './components/Header';
import { MoiPageDispatcher } from './pages/Moi/MoiPageDispatcher';

export default function App(): JSX.Element {
  const [currentService, setCurrentService] = useState<string>('');

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/:slug/login" element={<LoginForm />} />
        <Route path="/:slug/2fa/init" element={<QRCode2FA />} />
        <Route path="/:slug/verify-2fa" element={<Verify2FA />} />
        <Route path="/:slug/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/:slug/reset-password/request" element={<ResetPasswordRequest />} />
        <Route path="/not-found" element={<NotFoundPage />} />

        {/* Page d’accueil (privée) */}
        <Route
          path="/:slug/"
          element={
            <PrivateRoute>
              <Header onNavigateHome={() => window.history.back()} />
              <HomeDispatcher
                onPageChange={(page) => (window.location.href = `/${getSlug()}/${page}`)}
                onServiceClick={(name) => (window.location.href = `/${getSlug()}/service/${name}`)}
                onNavigateToMessages={() => (window.location.href = `/${getSlug()}/nous`)}
              />
            </PrivateRoute>
          }
        />

        {/* Page "Moi" avec dispatcher */}
        <Route
          path="/:role/:slug/moi"
          element={
            <PrivateRoute>
              <Header onNavigateHome={() => window.history.back()} />
              <MoiPageDispatcher /> {/* ✅ dispatcher intelligent */}
            </PrivateRoute>
          }
        />

        {/* Page "Nous" */}
        <Route
          path="/:slug/nous"
          element={
            <PrivateRoute>
              <Header onNavigateHome={() => window.history.back()} />
              <NousPage />
            </PrivateRoute>
          }
        />

        {/* Page Service */}
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

// 🔧 Helper pour récupérer le slug actuel
function getSlug(): string {
  const parts = window.location.pathname.split('/');
  return parts[1] || 'default-slug';
}
