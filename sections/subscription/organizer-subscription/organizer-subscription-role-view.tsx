'use client';

import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { OrganizerSubscriptionView } from './organizer-subscription-view';
import { OrganizerSubscriptionViewOnly } from './organizer-subscription-view-only';

export const OrganizerSubscriptionRoleView = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);
  const isManager = user?.accountState?.userType === 'manager';

  if (isManager) {
    return <OrganizerSubscriptionViewOnly />;
  }

  return <OrganizerSubscriptionView />;
};
