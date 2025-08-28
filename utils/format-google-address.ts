type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GeometryLocationFn = {
  lat: () => number;
  lng: () => number;
};

type GeometryLocationNum = {
  lat?: number;
  lng?: number;
};

type AddressObject = {
  formatted_address?: string;
  address_components?: AddressComponent[];
  geometry?: {
    location?: GeometryLocationFn | GeometryLocationNum;
  };
};

type ExtractedAddress = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  province: string; // state / region
  postal_code: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
};

// Optional: your compare function
declare function isSameAddress(a: ExtractedAddress, b: ExtractedAddress): boolean;

export const extractAddress = async (
  addressObj: AddressObject,
  existingAddress: ExtractedAddress | null = null
): Promise<ExtractedAddress> => {
  const components = addressObj.address_components ?? [];
  const location = addressObj.geometry?.location;

  const getComponent = (types: string[]): string =>
    components.find(c => types.every(t => c.types.includes(t)))?.long_name ?? '';

  const getShortComponent = (types: string[]): string =>
    components.find(c => types.every(t => c.types.includes(t)))?.short_name ?? '';

  const lat =
    location && typeof (location as any).lat === 'function'
      ? (location as GeometryLocationFn).lat()
      : (location as GeometryLocationNum)?.lat ?? 0;

  const lng =
    location && typeof (location as any).lng === 'function'
      ? (location as GeometryLocationFn).lng()
      : (location as GeometryLocationNum)?.lng ?? 0;

  const newAddress: ExtractedAddress = {
    address_line_1: addressObj.formatted_address ?? '',
    address_line_2: '',
    city: getComponent(['locality']) || getComponent(['administrative_area_level_2']) || '',
    province: getComponent(['administrative_area_level_1']) || '',
    postal_code: getComponent(['postal_code']) || '',
    country: getComponent(['country']) || '',
    country_code: getShortComponent(['country']) || '',
    latitude: lat,
    longitude: lng,
  };

  if (existingAddress && isSameAddress(existingAddress, newAddress)) {
    return existingAddress;
  }

  return newAddress;
};
