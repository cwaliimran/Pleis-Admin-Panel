'use client';

import React from 'react';
import type { Option } from './types'; // assume Option type is defined elsewhere
import { UseFormReturn } from 'react-hook-form'; // Import UseFormReturn type

import OrganizerFields from './organizer-fields';
import ManagerFields from './manager-fields';
import StaffFields from './staff-fields';
import UserFields from './user-fields';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

interface RoleSpecificFieldsProps {
  role: RoleKey;
  organizationOptions: Option[];
  supplierOptions: Option[];
  methods: UseFormReturn<any, any>; // Add methods prop with UseFormReturn type
}

const RoleSpecificFields: React.FC<RoleSpecificFieldsProps> = ({
  role,
  organizationOptions,
  supplierOptions,
  methods,
}) => {
  switch (role) {
    case 'admin':
    case 'guest':
      return null;
    case 'organizer':
      return <OrganizerFields supplierOptions={supplierOptions} methods={methods} />;
    case 'manager':
      return <ManagerFields organizationOptions={organizationOptions} />;
    case 'staff':
      return <StaffFields organizationOptions={organizationOptions} />;
    case 'user':
      return <UserFields organizationOptions={organizationOptions} />;
    default:
      return null;
  }
};

export default RoleSpecificFields;