import { create } from 'zustand';

const THEME_KEY = 'websiteName-theme';

// Apply the theme to the document
const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
};

// Get the current theme (from localStorage or device preference)
const getTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Change the theme and update localStorage 
const themeStore = (set) => ({
  theme: getTheme(),
  setTheme: (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      localStorage.setItem(THEME_KEY, newTheme);
    } else if (newTheme === 'device') {
      localStorage.removeItem(THEME_KEY);
      newTheme = getTheme();
    }
    applyTheme(newTheme);
    set({ theme: newTheme });
  },
})

// Handles system theme changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => {
    if (!localStorage.getItem(THEME_KEY)) {
      const systemTheme = getTheme();
      applyTheme(systemTheme);
      useThemeStore.setState({ theme: systemTheme });
    }
  });
// Initialize the theme on load
applyTheme(getTheme());

export const useThemeStore = create(themeStore);