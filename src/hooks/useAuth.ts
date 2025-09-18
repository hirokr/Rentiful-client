import { useAppSelector, useAppDispatch } from '@/state/redux';
import { loginUser, registerUser, logoutUser, validateToken } from '@/state/authSlice';
import type { LoginCredentials, RegisterCredentials } from '@/lib/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials));
  };

  const register = async (credentials: RegisterCredentials) => {
    return dispatch(registerUser(credentials));
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const validate = async () => {
    return dispatch(validateToken());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    validate,
  };
};