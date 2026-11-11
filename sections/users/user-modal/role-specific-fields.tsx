'use client';

import React from 'react';
import type { Option } from './types';
import { UseFormReturn } from 'react-hook-form';

import OrganizerFields from './organizer-fields';
import ManagerFields from './manager-fields';
import StaffFields from './staff-fields';
import UserFields from './user-fields';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

interface RoleSpecificFieldsProps {
  role: RoleKey;
  supplierOptions: Option[];
  supplierLoading: boolean;
  methods: UseFormReturn<any, any>;
  userData?: any;
  mode?: 'create' | 'edit';
}

const RoleSpecificFields: React.FC<RoleSpecificFieldsProps> = ({
  role,
  supplierOptions,
  supplierLoading,
  methods,
  userData,
  mode = 'create',
}) => {
  switch (role) {
    case 'admin':
    case 'guest':
      return null;
    case 'organizer':
      return <OrganizerFields supplierOptions={supplierOptions} methods={methods} supplierLoading={supplierLoading} />;
    case 'manager':
      return <ManagerFields userData={userData} />;
    case 'staff':
      return <StaffFields userData={userData} />;
    case 'user':
      return <UserFields mode={mode} />;
    default:
      return null;
  }
};

export default RoleSpecificFields;
