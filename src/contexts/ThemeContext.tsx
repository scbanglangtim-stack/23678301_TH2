import React, { createContext, useContext, useState, ReactNode } from 'react';
import { COLORS } from '@constants/theme';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textLight: string;
  primary: string;
  secondary: string;
  border: string;
}

const LIGHT_THEME: ThemeColors = {
  background: COLORS.background,
  surface: COLORS.surface,
  text: COLORS.text,
  textLight: COLORS.textLight,
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  border: COLORS.border,
};

const DARK_THEME: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  textLight: '#94A3B8',
  primary: '#3B82F6',
  secondary: '#FB923C',
  border: '#334155',
};

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const value: ThemeContextValue = {
    isDark,
    colors: isDark ? DARK_THEME : LIGHT_THEME,
    toggleTheme: () => setIsDark((prev) => !prev),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme phải được sử dụng bên trong <ThemeProvider>');
  }
  return ctx;
};

export default ThemeContext;
