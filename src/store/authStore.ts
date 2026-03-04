import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../lib/apiClient';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

// Imported lazily to avoid circular dependency
const clearCartStore = () => {
  try {
    // Directly clear the localStorage key used by cartStore
    const raw = localStorage.getItem('kodemy-cart');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.state.purchased = [];
      parsed.state.items = [];
      localStorage.setItem('kodemy-cart', JSON.stringify(parsed));
    }
  } catch (e) {
    // If anything goes wrong, just remove the key entirely
    localStorage.removeItem('kodemy-cart');
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      fetchUser: async () => {
        try {
          const { data } = await apiClient.get('/auth/me');
          set({ user: data });
        } catch {
          // If fetch fails, don't crash — user info just won't be available
        }
      },
      logout: () => {
        // Clear cart purchased state so the next user doesn't see stale data
        clearCartStore();
        set({ accessToken: null, isAuthenticated: false, user: null });
        apiClient.post('/auth/logout').catch(() => {});
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
