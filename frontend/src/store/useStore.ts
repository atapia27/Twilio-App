// frontend/src/store/useStore.ts

import {create} from 'zustand';

interface StoreState {
  token: string;
  setToken: (token: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  token: '',
  setToken: (token) => set({ token }),
}));
