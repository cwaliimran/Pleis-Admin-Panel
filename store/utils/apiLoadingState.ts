// Utility for standardized loading and error state management

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function initialApiState<T>(): ApiState<T> {
  return {
    data: null,
    loading: false,
    error: null,
  };
}

export function setLoading<T>(state: ApiState<T>): ApiState<T> {
  return { ...state, loading: true, error: null };
}

export function setError<T>(state: ApiState<T>, error: string): ApiState<T> {
  return { ...state, loading: false, error };
}

export function setData<T>(state: ApiState<T>, data: T): ApiState<T> {
  return { ...state, data, loading: false, error: null };
}
