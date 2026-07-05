import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser, checkAuth, clearError } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { LoginCredentials, RegisterData } from '../types/auth.types';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth() as any);
  }, [dispatch]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials) as any);
  }, [dispatch]);

  const register = useCallback(async (data: RegisterData) => {
    return dispatch(registerUser(data) as any);
  }, [dispatch]);

  const logout = useCallback(async () => {
    return dispatch(logoutUser() as any);
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  };
}
