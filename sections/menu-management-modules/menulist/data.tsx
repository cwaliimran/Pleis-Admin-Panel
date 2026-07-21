import { MenuListItem, MenuOrganization } from './types';

// TODO(v2-api): replace with real organization data once the backend endpoint is ready.
export const mockOrganizations: MenuOrganization[] = [
  { _id: 'org-1', name: 'PLEIS Vrbani' },
  { _id: 'org-2', name: 'PLEIS Črnomerec' },
  { _id: 'org-3', name: 'PLEIS Trešnjevka' },
  { _id: 'org-4', name: 'PLEIS Maksimir' },
  { _id: 'org-5', name: 'Black Swan Lounge' },
];

// TODO(v2-api): replace with real menu list data once the backend endpoint is ready.
export const mockMenuListData: MenuListItem[] = [
  {
    _id: 'menu-1',
    title: 'Summer Menu 2026',
    description: 'Main price list — all day service',
    organizations: ['org-1'],
    validFrom: '2026-06-01',
    status: 'active',
    createdAt: '2026-06-01',
  },
  {
    _id: 'menu-2',
    title: 'Winter Menu 2025',
    description: 'Seasonal menu — Oct to Feb',
    organizations: ['org-1'],
    validFrom: '2025-10-01',
    status: 'inactive',
    createdAt: '2025-09-15',
  },
  {
    _id: 'menu-3',
    title: 'Event Menu — Black Swan',
    description: 'Special event price list',
    organizations: ['org-5'],
    validFrom: '2026-07-15',
    status: 'draft',
    createdAt: '2026-05-20',
  },
];
