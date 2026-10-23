import api, { setAccessToken } from './api';
import type { ApiResponse } from '../types/api';
import type { User, LoginCredentials, RegisterPayload, AuthTokens } from '../types/user';

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: User } & AuthTokens>> {
    const { data } = await api.post('/auth/register', payload);
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User } & AuthTokens>> {
    const { data } = await api.post('/auth/login', credentials);
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const { data } = await api.post('/auth/refresh');
    if (data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    }
    return data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
