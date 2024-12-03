export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}