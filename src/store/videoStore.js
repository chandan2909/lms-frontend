import { create } from 'zustand';



const useVideoStore = create((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,
  setVideoState: (state) => set((prev) => ({ ...prev, ...state })),
  reset: () => set({
    currentVideoId: null,
    subjectId: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isCompleted: false,
    nextVideoId: null,
    prevVideoId: null,
  }),
}));

export default useVideoStore;
