import { create } from 'zustand';

type isLoggedType = {
  isLogged: boolean | null;
  setIsLogged: (isLogged: boolean | null) => void;
};

export const useZustand = create<isLoggedType>((set) => ({
  isLogged: false,
  setIsLogged: (isLogged: boolean | null) => set((state) => ({ ...state, isLogged })),
}));
