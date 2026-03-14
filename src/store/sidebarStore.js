import { create } from 'zustand';
import apiClient from '../lib/apiClient';



const useSidebarStore = create((set, get) => ({
  tree: null,
  loading: false,
  error: null,
  fetchTree: async (subjectId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get(`/subjects/${subjectId}/tree`);
      set({ tree: data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch tree', loading: false });
    }
  },
  markVideoCompleted: (videoId) => {
    const { tree, fetchTree } = get();
    if (!tree) return;
    
    // Optimistic update
    const updatedSections = tree.sections.map((section) => ({
      ...section,
      videos: section.videos.map((video) => 
        video.id === videoId ? { ...video, is_completed: true } : video
      )
    }));
    
    set({ tree });

    // Refetch to get updated locked statuses from backend
    fetchTree(tree.id);
  },
}));

export default useSidebarStore;
