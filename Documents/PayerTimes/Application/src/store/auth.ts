import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

// Mock user data - In production, this would come from your backend
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@islamiccenter.com',
    name: 'Admin User',
    role: 'admin',
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Mock authentication - Replace with actual API call
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user && password === 'admin123') {
      set({ user, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (email: string, password: string, name: string) => {
    // Mock registration - Replace with actual API call
    if (MOCK_USERS.some((u) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email,
      name,
      role: 'editor',
    };
    
    MOCK_USERS.push(newUser);
    set({ user: newUser, isAuthenticated: true });
  },

  resetPassword: async (email: string) => {
    // Mock password reset - Replace with actual API call
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }
    // In a real app, this would send a reset email
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));