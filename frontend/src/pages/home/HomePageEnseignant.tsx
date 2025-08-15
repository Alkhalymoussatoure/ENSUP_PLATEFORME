import React from 'react';
import { HomePageProps } from './HomePageProps';

import StatusPanel from '../../components/Enseignant/DashboardEnseignant/StatusPanelEnseignant';
import EventsPanel from '../../components/EventsPanel';
import HeadlinesCarousel from '../../components/HeadlinesCarousel';

export default function HomePageEnseignant({ onNavigateToMessages, onServiceClick }: HomePageProps) {
  return (
    <>
      <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
      <EventsPanel />
      <HeadlinesCarousel />
    </>
  );
}
// je doit lui passer les bons composants à ce dashboard enseignant 