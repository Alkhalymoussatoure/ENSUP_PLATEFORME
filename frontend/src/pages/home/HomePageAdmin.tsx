import React from 'react';
import { HomePageProps } from './HomePageProps';
import StatusPanel from '../../components/Admin/DashboardAdmin/StatusPanelAdmin';
import EventsPanel from '../../components/EventsPanel';
import HeadlinesCarousel from '../../components/HeadlinesCarousel';

export default function HomePageAdmin({ onNavigateToMessages, onServiceClick }: HomePageProps) {
  return (
    <>
      <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
      <EventsPanel />
      <HeadlinesCarousel />
    </>
  );
}

//je doit lui passer les composants pour cette page d'accueil admin  