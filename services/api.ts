const API_BASE = 'https://v2.api.noroff.dev';
const API_KEY = 'ad671a7a-8b8e-4cb4-941e-3413ec3b45fe';

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  auth: boolean = false
) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': API_KEY,
  };

  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.errors?.[0]?.message || 'API request failed',
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'API request failed',
    };
  }
};