// components/GoogleLocationInput.tsx
'use client';

import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { useFormContext, Controller } from 'react-hook-form';
import { extractAddress } from '@/utils/format-google-address';
import React, { useRef } from 'react';

// CLIENT API KEY
// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// SAMPLE API KEY
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_SAMPLE_GOOGLE_MAPS_API_KEY;

const googleMapsLibraries: 'places'[] = ['places'];

interface GoogleLocationInputProps {
  name: string;
  showLabel?: boolean;
  label: string;
}

const GoogleLocationInput: React.FC<GoogleLocationInputProps> = ({
  name,
  label,
  showLabel = true,
}) => {
  const { control, setValue } = useFormContext();
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
    libraries: googleMapsLibraries,
  });

  const handleOnPlacesChanged = async () => {
    const places = inputRef.current?.getPlaces();
    if (places && places.length > 0) {
      const address = await extractAddress(places[0]);
      const locationPayload = {
        address: address.address_line_1 || '',
        city: address.city || '',
        postalCode: address.postal_code || '',
        country: address.country || '',
        coordinates: [address.latitude || 0, address.longitude || 0],
      };
      console.log('Setting location payload:', locationPayload);
      setValue(name, locationPayload, { shouldValidate: true });
    }
  };

  return (
    <div className="w-full">
      {showLabel && (
        <label
          htmlFor={`${name}-input`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      {isLoaded && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <StandaloneSearchBox
              onLoad={(searchBox) => {
                inputRef.current = searchBox;
              }}
              onPlacesChanged={handleOnPlacesChanged}
            >
              <input
                id={`${name}-input`}
                type="text"
                placeholder="Enter Location"
                defaultValue={field.value?.address || ''}
                className={` ${showLabel ? 'mt-2' : 'mt-0'} h-[40px] w-full rounded-md border bg-white px-2 py-1 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 dark:bg-[#212121] dark:placeholder:text-slate-400`}
                onChange={(e) =>
                  field.onChange({ ...field.value, address: e.target.value })
                }
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
            </StandaloneSearchBox>
          )}
        />
      )}
    </div>
  );
};

export default GoogleLocationInput;
