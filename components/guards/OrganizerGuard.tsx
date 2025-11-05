'use client';

import RouteGuard from './RouteGuard';

interface OrganizerGuardProps {
  children: React.ReactNode;
}

export default function OrganizerGuard({ children }: OrganizerGuardProps) {
  return <RouteGuard allowedRoles={['organizer']}>{children}</RouteGuard>;
}
