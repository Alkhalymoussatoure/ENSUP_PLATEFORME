import React from 'react';
import StatusPanel from '../../components/StatusPanel';
import NewsCarousel from '../../components/NewsCarousel';
import EventsPanel from '../../components/EventsPanel';
import HeadlinesCarousel from '../../components/HeadlinesCarousel';
import { HomePageProps } from './HomePageProps';

export default function HomePageEtudiant({ onNavigateToMessages, onServiceClick }: HomePageProps) {
  return (
    <>
      <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
      <NewsCarousel />
      <EventsPanel />
      <HeadlinesCarousel />
    </>
  );
}
