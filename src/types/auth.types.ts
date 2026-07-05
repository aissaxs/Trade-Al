export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  country: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  country: string;
}

export interface OTPData {
  email: string;
  code: string;
}

export interface GoogleAuthData {
  idToken: string;
  email: string;
  name: string;
  photoUrl?: string;
}
