import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store Properties
const themeStore = (set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  setTheme: (newTheme) => set({ theme: newTheme }),
})

// Store Created
// Only persist the theme property
const useThemeStore = create(
  persist(themeStore, {
    name: 'quickdraw_theme',
    partialize: (state) => ({ theme: state.theme }),
  })
);


export { useThemeStore };
