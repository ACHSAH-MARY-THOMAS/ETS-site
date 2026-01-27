// API configuration and service functions
const API_BASE_URL = 'http://127.0.0.1:8000';

// API client with credentials support for session-based auth
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || error.detail || 'Request failed');
  }

  return response.json();
};

// Get CSRF token
export const getCsrfToken = async () => {
  return apiClient('/api/csrf/');
};

// Login
export const login = async (teamId: string, password: string) => {
  return apiClient('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      team_id: teamId,
      password: password,
    }),
  });
};

// Logout
export const logout = async () => {
  return apiClient('/api/auth/logout/', {
    method: 'POST',
  });
};

// Get current level
export const getCurrentLevel = async () => {
  return apiClient('/api/game/level/');
};

// Submit answer
export const submitAnswer = async (answer: string) => {
  return apiClient('/api/game/submit/', {
    method: 'POST',
    body: JSON.stringify({ answer }),
  });
};

// Get team status
export const getTeamStatus = async () => {
  return apiClient('/api/game/status/');
};
