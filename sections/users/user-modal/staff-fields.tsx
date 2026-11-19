// 'use client';

// import React, { useEffect, useState } from 'react';
// import type { Option } from './types';
// import { UseFormReturn } from 'react-hook-form';
// import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';

// const moduleOptions: Option[] = [
//   { value: 'inAppOrdering', label: 'In-App Ordering' },
//   { value: 'reservationManagement', label: 'Reservation Management' },
//   { value: 'loyaltyScanning', label: 'Loyalty Scanning' },
//   { value: 'ticketing', label: 'Ticketing' },
// ];

// interface StaffFieldsProps {
//   organizationOptions: Option[];
//   methods: UseFormReturn<any, any>;
//   userData?: any;
// }

// const StaffFields: React.FC<StaffFieldsProps> = ({
//   organizationOptions,
//   methods,
//   userData,
// }) => {
//   const [selectedOrgIndex, setSelectedOrgIndex] = useState(0);

//   // Get the initial selected organization and its features
//   useEffect(() => {
//     if (userData?.organizations && userData.organizations.length > 0) {
//       const initialOrgId = userData.organizations[0]._id;
//       methods.setValue('organizations', [initialOrgId]);
//       const initialFeatures =
//         userData.organizations[0].staff.find(
//           (staff: any) => staff.user === userData._id
//         )?.featuresAccess || [];
//       methods.setValue('modules', initialFeatures);
//     }
//   }, [userData, methods]);

//   // Update modules when organization changes
//   const handleOrgChange = (selectedOrgs: string[]) => {
//     if (selectedOrgs.length > 0) {
//       const orgIndex = organizationOptions.findIndex(
//         (org) => org.value === selectedOrgs[0]
//       );
//       setSelectedOrgIndex(orgIndex >= 0 ? orgIndex : 0);
//       const selectedOrg = userData?.organizations.find(
//         (org: any) => org._id === selectedOrgs[0]
//       );
//       const features =
//         selectedOrg?.staff.find((staff: any) => staff.user === userData?._id)
//           ?.featuresAccess || [];
//       methods.setValue('modules', features);
//     }
//   };

//   return (
//     <>
//       <div className="md:col-span-2">
//         <RHFCustomCombobox
//           name="organizations"
//           label="Select Organizations"
//           placeholder="Select organizations"
//           className="w-full flex-1"
//           multiple={true}
//           allowCustom={false}
//           options={organizationOptions}
//           onChange={handleOrgChange}
//           maxSelected={1}
//         />
//       </div>

//       <div className="md:col-span-2">
//         <h3 className="text-md font-semibold">
//           Feature Access for{' '}
//           {organizationOptions[selectedOrgIndex]?.label ||
//             'Selected Organization'}
//         </h3>
//         <ul className="mt-2 list-disc pl-5">
//           {moduleOptions.map((module) => (
//             <li
//               key={module.value}
//               className={
//                 methods.watch('modules').includes(module.value)
//                   ? 'text-green-600'
//                   : 'text-gray-500'
//               }
//             >
//               {module.label}{' '}
//               {methods.watch('modules').includes(module.value)
//                 ? '(Enabled)'
//                 : '(Disabled)'}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default StaffFields;

'use client';

import { RHFAsyncCombobox } from '@/components/rhf';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import React, { useMemo } from 'react';
import type { Option } from './types';

const ORGANIZATION_QUERY_ARGS = { sortBy: 'organizationName', sortOrder: 'asc' };

interface StaffFieldsProps {
  userData?: any;
}

const moduleOptions: Option[] = [
  { value: 'inAppOrdering', label: 'In-App Ordering' },
  { value: 'reservationManagement', label: 'Reservation Management' },
  { value: 'loyaltyScanning', label: 'Loyalty Scanning' },
  { value: 'ticketing', label: 'Ticketing' },
];

const StaffFields: React.FC<StaffFieldsProps> = ({ userData }) => {
  const initialSelected = useMemo(
    () =>
      userData?.organizations?.length
        ? userData.organizations
            .filter((org: any) => org?._id)
            .map((org: any) => ({
              value: org._id,
              label: org?.basicInfo?.name || org?.name || '',
            }))
        : undefined,
    [userData]
  );

  return (
    <>
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

      <div className="md:col-span-2">
        <RHFMultiSelect
          name="modules"
          label="Module Access"
          placeholder="Select Modules"
          options={moduleOptions}
        />
      </div>
    </>
  );
};

export default StaffFields;
