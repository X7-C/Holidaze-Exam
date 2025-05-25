const API_BASE = 'https://v2.api.noroff.dev';

export interface AuthResponse {
  accessToken: string;
  name: string;
  email: string;
  avatar?: string;
  venueManager: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData): Promise<{ data: AuthResponse }> => {
  const response = await fetch(`${API_BASE}/auth/register?_holidaze=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || 'Registration failed');
  }

  return await response.json();
};

export const loginUser = async (data: LoginData): Promise<{ data: AuthResponse }> => {
  const response = await fetch(`${API_BASE}/auth/login?_holidaze=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || 'Login failed');
  }

  return await response.json();
};

export const getToken = (): string | null => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.accessToken || null;
};


export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
