
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeMode, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'galilee', 
  toggleTheme: () => {}, 
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key 
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('galilee');
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Check localStorage or system pref logic here if needed
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'pro' ? 'galilee' : 'pro');
  };
  
  const t = (key: string) => getTranslation(language, key);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
