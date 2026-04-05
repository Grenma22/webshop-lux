import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api';

  const fetchApi = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const headers = { ...options.headers };
      if (token && !headers['Authorization']) {
        headers['Authorization'] = "Bearer " + token;
      }
      if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(API_URL + endpoint, { ...options, headers });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          logout();
        }
        throw new Error(data.error || 'API Error');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  return { fetchApi, loading, error };
}
