import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchProfile,
  clearError,
} from '../store/slices/authSlice';
import type { LoginCredentials, RegisterPayload } from '../types/user';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (payload: RegisterPayload) => dispatch(registerUser(payload)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const loadProfile = useCallback(() => dispatch(fetchProfile()), [dispatch]);

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    ...auth,
    login,
    register,
    logout,
    loadProfile,
    resetError,
  };
};
