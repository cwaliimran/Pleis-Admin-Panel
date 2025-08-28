'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface PlacesAutocompleteProps {
  value?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  // optional react-hook-form setValue and field name so parent can sync directly
  setValue?: ((name: string, value: any, options?: any) => void) | undefined;
  name?: string;
  // optional callback to receive full place details
  onPlaceSelected?: (place: any) => void;
  error?: string | { message?: string } | undefined;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder = 'Search location',
  className,
  setValue,
  name,
  onPlaceSelected,
  error,
}: PlacesAutocompleteProps) {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (window as any).google &&
      (window as any).google.maps &&
      (window as any).google.maps.places
    ) {
      autocompleteServiceRef.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
      placesServiceRef.current = new (
        window as any
      ).google.maps.places.PlacesService(document.createElement('div'));
    }
  }, []);

  const fetchPredictions = useCallback((input: string) => {
    if (!input || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }
    autocompleteServiceRef.current.getPlacePredictions(
      { input, types: ['geocode'] },
      (preds: any[] | null) => {
        setPredictions(preds || []);
        setActiveIndex(-1);
      }
    );
  }, []);

  const pickPrediction = useCallback(
    (pred: any) => {
      if (!placesServiceRef.current) return;
      placesServiceRef.current.getDetails(
        {
          placeId: pred.place_id,
          fields: [
            'formatted_address',
            'name',
            'geometry',
            'address_components',
          ],
        },
        (place: any) => {
          if (!place) return;
          const formatted =
            place.formatted_address || place.name || pred.description || '';

          // Defensive DOM update and native input event for environments where React controlled updates lag
          if (inputRef.current) {
            try {
              inputRef.current.value = formatted;
              const evt = new Event('input', { bubbles: true });
              inputRef.current.dispatchEvent(evt);
            } catch {
              // ignore
            }
          }

          // Sync with parent (controlled input) and optionally react-hook-form setValue
          onChange(formatted);
          if (setValue && name)
            setValue(name, formatted, { shouldValidate: true });

          setPredictions([]);

          if (onPlaceSelected) onPlaceSelected(place);
        }
      );
    },
    [onChange, setValue, name, onPlaceSelected]
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={value ?? ''}
        onChange={(e) => {
          onChange(e.target.value);
          fetchPredictions(e.target.value);
        }}
        onBlur={() => onBlur && onBlur()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, predictions.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && predictions[activeIndex]) {
              e.preventDefault();
              pickPrediction(predictions[activeIndex]);
            }
          } else if (e.key === 'Escape') {
            setPredictions([]);
          }
        }}
        placeholder={placeholder}
        className={
          className ||
          'w-full rounded border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
        }
      />

      {predictions && predictions.length > 0 && (
        <ul className="absolute right-0 left-0 z-50 mt-1 max-h-56 overflow-auto rounded border bg-white dark:bg-[#111]">
          {predictions.map((p: any, idx: number) => (
            <li
              key={p.place_id}
              onMouseDown={(ev) => {
                // onMouseDown prevents the input blur from hiding list before click
                ev.preventDefault();
                pickPrediction(p);
              }}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                idx === activeIndex ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            >
              {p.description || p.structured_formatting?.main_text}
            </li>
          ))}
        </ul>
      )}

      {error && typeof error === 'object' && 'message' in error ? (
        <p className="mt-1 text-xs text-red-500">{(error as any).message}</p>
      ) : null}
    </div>
  );
}
