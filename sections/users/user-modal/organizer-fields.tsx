'use client';

import { RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import React from 'react';
import type { Option } from './types';
import GoogleLocationInput from '@/components/common/location-input';

interface OrganizerFieldsProps {
  supplierOptions: Option[];
  methods: any;
}

const OrganizerFields: React.FC<OrganizerFieldsProps> = ({
  supplierOptions,
}) => {
  return (
    <>
      <RHFTextField
        name="organizationName"
        label="Organization Name"
        placeholder="Enter organization name"
      />
      <div className="md:col-span-2">
        <RHFTextField
          name="companyName"
          label="Company Name"
          placeholder="Enter company name"
        />
      </div>
      <RHFTextField name="oib" label="OIB" placeholder="Enter OIB" />
      <div className="md:col-span-2">
        <RHFTextField
          name="bankAccountNumber"
          label="Bank Account Number"
          placeholder="Enter bank account number"
        />
      </div>
      <div className="md:col-span-2">
        <RHFTextField
          name="representativeName"
          label="Representative Name"
          placeholder="Enter representative name"
        />
      </div>

      <div className="input md:col-span-2">
        <GoogleLocationInput name="location" label="Location" />
      </div>

      <div className="md:col-span-2">
        <RHFCustomCombobox
          name="suppliers"
          label="Select Suppliers"
          placeholder="Select Suppliers"
          className="w-full flex-1"
          multiple={true}
          allowCustom={false}
          options={supplierOptions}
        />
      </div>
    </>
  );
};

export default OrganizerFields;

// 'use client';

// import GoogleLocationInput from '@/components/common/location-input';
// import { RHFTextField } from '@/components/rhf';
// import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
// import { extractAddress } from '@/utils/format-google-address';
// import { useJsApiLoader } from '@react-google-maps/api';
// import React, { useRef } from 'react';
// import type { Option } from './types';

// // PLEIS CLIENT
// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_SAMPLE_GOOGLE_MAPS_API_KEY;
// const googleMapsLibraries: 'places'[] = ['places'];

// interface OrganizerFieldsProps {
//   supplierOptions: Option[];
//   methods: any;
// }

// const OrganizerFields: React.FC<OrganizerFieldsProps> = ({
//   supplierOptions,
//   methods,
// }) => {
//   const inputRef = useRef<google.maps.places.SearchBox | null>(null);

//   return (
//     <>
//       <RHFTextField
//         name="organizationName"
//         label="Organization Name"
//         placeholder="Enter organization name"
//       />
//       <div className="md:col-span-2">
//         <RHFTextField
//           name="companyName"
//           label="Company Name"
//           placeholder="Enter company name"
//         />
//       </div>
//       <RHFTextField name="oib" label="OIB" placeholder="Enter OIB" />
//       <div className="md:col-span-2">
//         <RHFTextField
//           name="bankAccountNumber"
//           label="Bank Account Number"
//           placeholder="Enter bank account number"
//         />
//       </div>
//       <div className="md:col-span-2">
//         <RHFTextField
//           name="representativeName"
//           label="Representative Name"
//           placeholder="Enter representative name"
//         />
//       </div>

//       <div className="input md:col-span-2">
//         <GoogleLocationInput name="location" label="Location" />{' '}
//       </div>

//       <div className="md:col-span-2">
//         <RHFCustomCombobox
//           name="suppliers"
//           label="Select Suppliers"
//           placeholder="Select Suppliers"
//           className="w-full flex-1"
//           multiple={true}
//           allowCustom={false}
//           options={supplierOptions}
//         />
//       </div>
//     </>
//   );
// };

// export default OrganizerFields;
