'use client';

import React, { useRef } from 'react';
import { RHFTextField } from '@/components/rhf';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { extractAddress } from '@/utils/format-google-address'; // Assuming this utility exists
import type { Option } from './types';

// PLEIS CLIENT
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_SAMPLE_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries: ('places')[] = ['places'];

interface OrganizerFieldsProps {
    supplierOptions: Option[];
    methods: any; // From FormProvider
}

const OrganizerFields: React.FC<OrganizerFieldsProps> = ({ supplierOptions, methods }) => {
    const inputRef = useRef<google.maps.places.SearchBox | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
        libraries: googleMapsLibraries, // Use the static constant
    });

    const handleOnPlacesChanged = async () => {
        const places = inputRef.current?.getPlaces();
        if (places && places.length > 0) {
            const address = await extractAddress(places[0]);
            const locationPayload = {
                fullAddress: address.address_line_1 || '',
                state: address.province || '',
                city: address.city || '',
                postalCode: address.postal_code || '',
                country: address.country || '',
                coordinates: [address.latitude || 0, address.longitude || 0],
            };
            console.log('Setting location payload:', locationPayload); // Debug log
            methods.setValue('location', locationPayload, { shouldValidate: true });
        }
    };

    return (
        <>
            <RHFTextField name="organizationName" label="Organization Name" />
            <div className="md:col-span-2">
                <RHFTextField name="companyName" label="Company Name" />
            </div>
            <RHFTextField name="oib" label="OIB" />
            <div className="md:col-span-2">
                <RHFTextField name="bankAccountNumber" label="Bank Account Number" />
            </div>
            <div className="md:col-span-2">
                <RHFTextField name="representativeName" label="Representative Name" />
            </div>

            <div className="input md:col-span-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                </label>
                {isLoaded && (
                    <StandaloneSearchBox
                        onLoad={(searchBox) => {
                            inputRef.current = searchBox;
                        }}
                        onPlacesChanged={handleOnPlacesChanged}
                    >
                        <input
                            id="location"
                            type="text"
                            placeholder=""
                            defaultValue={methods.getValues('location?.fullAddress') || ''}
                            className="mt-2 h-[40px] w-full rounded-md border bg-white px-2 py-1 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 dark:bg-[#212121] dark:placeholder:text-slate-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Prevents form submission
                                }
                            }}
                        />
                    </StandaloneSearchBox>
                )}
            </div>

            <div className="md:col-span-2">
                <RHFMultiSelect
                    name="suppliers"
                    label="Suppliers"
                    placeholder="Select Suppliers"
                    options={supplierOptions}
                />
            </div>
        </>
    );
};

export default OrganizerFields;