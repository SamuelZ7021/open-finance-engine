import { create } from "zustand";

interface UIState {
    isPrivacyMode: boolean;
    togglePrivacy: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isPrivacyMode: false,
    togglePrivacy: () => set((state) => ({ isPrivacyMode: !state.isPrivacyMode})),
}));