// Utility function to normalize API responses

export function normalizeApiResponse<T extends Record<string, any>>(
  data: T | T[]
): T[] {
  if (Array.isArray(data)) {
    return data.map((item) => ({ ...item }));
  }
  return [data];
}

// Example usage:
// const normalized = normalizeApiResponse(responseData);
