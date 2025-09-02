import { useCallback, useRef, useState, useEffect } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface PlaceSuggestion {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface LocationAutocompleteProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  onPlaceSelect?: (place: PlaceSuggestion) => void;
}

const LocationAutocomplete = <T extends FieldValues>({
  name,
  control,
  label = "Address",
  placeholder = "Enter address",
  className = "",
  error,
  disabled = false,
  onPlaceSelect,
}: LocationAutocompleteProps<T>) => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  
  // const debounceRef = useRef<NodeJS.Timeout>();
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Load Google Maps Script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key is not provided');
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (existingScript) {
      // Check if Google is already loaded
      if (window.google && window.google.maps) {
        setIsGoogleLoaded(true);
        initializeServices();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsGoogleLoaded(true);
      initializeServices();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };

    document.head.appendChild(script);
  }, [GOOGLE_MAPS_API_KEY]);

  // Initialize Google Services
  const initializeServices = () => {
    if (window.google && window.google.maps) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      
      // Create a hidden div for PlacesService (it needs a map or div element)
      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.display = 'none';
      document.body.appendChild(hiddenDiv);
      placesServiceRef.current = new window.google.maps.places.PlacesService(hiddenDiv);
    }
  };

  // Search places using Google Places AutocompleteService
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3 || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          types: ['establishment', 'geocode'],
        },
        (predictions, status) => {
          setIsSearching(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const placeSuggestions = predictions.map(prediction => ({
              place_id: prediction.place_id,
              formatted_address: prediction.description,
              name: prediction.structured_formatting.main_text || prediction.description,
            }));
            
            setSuggestions(placeSuggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
            console.warn('Places search failed:', status);
          }
        }
      );
    } catch (error) {
      console.error('Error searching places:', error);
      setIsSearching(false);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300);
  }, []);

  const handleInputChange = (value: string, onChange: (value: string) => void) => {
    onChange(value);
    if (value.length >= 3 && isGoogleLoaded) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: PlaceSuggestion, onChange: (value: string) => void) => {
    onChange(suggestion.formatted_address);
    setSuggestions([]);
    setShowSuggestions(false);

    // Get detailed place information
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const detailedPlace = {
              ...suggestion,
              geometry: place.geometry ? {
                location: {
                  lat: place.geometry.location?.lat() || 0,
                  lng: place.geometry.location?.lng() || 0,
                }
              } : undefined,
              name: place.name || suggestion.name,
              formatted_address: place.formatted_address || suggestion.formatted_address,
            };
            onPlaceSelect?.(detailedPlace);
          } else {
            onPlaceSelect?.(suggestion);
          }
        }
      );
    } else {
      onPlaceSelect?.(suggestion);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <div className="relative">
          {label && (
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value || ''}
              disabled={disabled || !isGoogleLoaded}
              className={`block w-full rounded-md border bg-white px-3 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:bg-[#171717] dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700 ${
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } ${className}`}
              autoComplete="off"
              onChange={(e) => handleInputChange(e.target.value, onChange)}
              onBlur={() => {
                // Delay the blur to allow clicking on suggestions
                setTimeout(() => {
                  onBlur();
                }, 150);
              }}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            
            {/* Loading Spinner */}
            {isSearching && (
              <div className="absolute top-1/2 right-8 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}

            {/* Loading indicator for Google Maps */}
            {!isGoogleLoaded && GOOGLE_MAPS_API_KEY && (
              <div className="absolute top-1/2 right-8 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
              </div>
            )}
            
            {/* Location Icon */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            
            {/* Custom Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:text-white transition-colors duration-150"
                    onClick={() => handleSuggestionSelect(suggestion, onChange)}
                    onMouseDown={(e) => {
                      // Prevent the input from losing focus
                      e.preventDefault();
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {suggestion.formatted_address}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {showSuggestions && suggestions.length === 0 && !isSearching && value && value.length >= 3 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-300 bg-white py-2 px-4 shadow-lg dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No locations found
                </div>
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
          
          {/* Status Messages */}
          {!isGoogleLoaded && GOOGLE_MAPS_API_KEY && (
            <p className="mt-1 text-xs text-gray-500">Loading Google Maps...</p>
          )}
          
          {!GOOGLE_MAPS_API_KEY && (
            <p className="mt-1 text-xs text-red-500">
              Google Maps API key is required
            </p>
          )}
        </div>
      )}
    />
  );
};

export default LocationAutocomplete;