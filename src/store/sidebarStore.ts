import { create } from 'zustand';
import apiClient from '../lib/apiClient';

interface SidebarState {
  tree: any | null;
  loading: boolean;
  error: string | null;
  fetchTree: (subjectId: number) => Promise<void>;
  markVideoCompleted: (videoId: number) => void;
}

const useSidebarStore = create<SidebarState>((set, get) => ({
  tree: null,
  loading: false,
  error: null,
  fetchTree: async (subjectId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get(`/subjects/${subjectId}/tree`);
      set({ tree: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tree', loading: false });
    }
  },
  markVideoCompleted: () => {
    const { tree } = get();
    if (!tree) return;
    
    // We update the store optimistically. Realistically, we'd trigger a refetch of the tree 
    // to get the true locked statuses, because completing one unlocks the next.
    // For simplicity, we just trigger a full fetch again in background if wanted,
    // or we just rely on page navigation. A refetch solves the complex lock logic perfectly.
    get().fetchTree(tree.id);
  },
}));

export default useSidebarStore;
