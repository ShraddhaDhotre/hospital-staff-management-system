import { useLayoutEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'staff-app-theme';

function readThemeFromDom() {
  if (typeof document === 'undefined') return 'light';
  const t = document.documentElement.dataset.theme;
  return t === 'dark' || t === 'light' ? t : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(readThemeFromDom);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
