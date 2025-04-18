import React from 'react';
import { useParams } from 'wouter';
import { DreamDashboard } from '@/components/dream-dashboard';

const DashboardPage: React.FC = () => {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return <DreamDashboard dreamId={id} />;
};

export default DashboardPage;
