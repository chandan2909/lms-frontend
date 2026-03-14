import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../lib/apiClient';
// Import the store (not just the hook) so we can call getState() outside React
import useCartStore from './cartStore';





const useAuthStore = create()(
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
        // Clear cart in-memory state AND localStorage so items disappear immediately
        useCartStore.getState().clearAll();
        set({ accessToken: null, isAuthenticated: false, user: null });
        apiClient.post('/auth/logout').catch(() => {});
      },
      deleteAccount: async () => {
        try {
          await apiClient.delete('/auth/me');
        } catch (error) {
          console.error('Failed to delete account on backend:', error);
        } finally {
          // Whether backend call succeeds or fails, clear local state so user is logged out
          useCartStore.getState().clearAll();
          set({ accessToken: null, isAuthenticated: false, user: null });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
