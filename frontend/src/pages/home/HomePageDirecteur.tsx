import React from 'react';
import { HomePageProps } from './HomePageProps';

import StatusPanel from '../../components/StatusPanel';
import EventsPanel from '../../components/EventsPanel';
import HeadlinesCarousel from '../../components/HeadlinesCarousel';

export default function HomePageDirecteur({ onNavigateToMessages, onServiceClick }: HomePageProps) {
  return (
    <>
      <StatusPanel onNavigateToMessages={onNavigateToMessages} onServiceClick={onServiceClick} />
      <EventsPanel />
      <HeadlinesCarousel />
    </>
  );
}
