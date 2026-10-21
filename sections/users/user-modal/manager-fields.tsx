'use client';

import { RHFAsyncCombobox } from '@/components/rhf';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import React, { useMemo } from 'react';

const ORGANIZATION_QUERY_ARGS = { sortBy: 'organizationName', sortOrder: 'asc' };

interface ManagerFieldsProps {
  userData?: any;
}

const toInitialSelected = (userData?: any) =>
  userData?.organizations?.length
    ? userData.organizations
        .filter((org: any) => org?._id)
        .map((org: any) => ({
          value: org._id,
          label: org?.basicInfo?.name || org?.name || '',
        }))
    : undefined;

const ManagerFields: React.FC<ManagerFieldsProps> = ({ userData }) => {
  const initialSelected = useMemo(() => toInitialSelected(userData), [userData]);

  return (
    <div className="md:col-span-2">
      <RHFAsyncCombobox
        name="organizations"
        label="Select Organizations"
        placeholder="Select organizations"
        searchPlaceholder="Search organizations..."
        className="w-full"
        limit={100}
        multiple
        initialSelected={initialSelected}
        useOptionsQuery={useGetOrganizationQuery}
        queryArgs={ORGANIZATION_QUERY_ARGS}
        getOptionValue={(org) => org._id}
        getOptionLabel={(org) => org?.basicInfo?.name}
      />
    </div>
  );
};

export default ManagerFields;
