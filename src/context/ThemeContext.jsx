import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('shopease_theme', 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
