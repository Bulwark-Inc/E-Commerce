import { useContext } from 'react';
import { EngagementContext } from './EngagementContext';

export const useEngagementContext = () => {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error('useEngagementContext must be used within an EngagementProvider');
  }
  return ctx;
};
