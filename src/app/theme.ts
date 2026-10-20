/**
 * Design tokens — direct port of the mobile app's theme
 * (app-baru/src/styles/theme.ts). The web edition MUST use these exact
 * values so the authenticated experience is visually identical to the app.
 */

export type Theme = {
  // Backgrounds
  background: string;
  surface: string;
  surfaceSoft: string;
  surfaceBorder: string;
  navBackground: string;
  cardBackground: string;

  // Primary colors
  bluePrimary: string;
  blueSecondary: string;
  purpleAccent: string;
  amberAccent: string;
  greenAccent: string;
  redAccent: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  // Glassmorphism
  glassBorder: string;
  glassBackground: string;
  glassHighlight: string;

  // Legacy aliases for compatibility
  primaryAccent: string;
  secondaryAccent: string;
  border: string;
};

export const darkTheme: Theme = {
  background: '#060816',
  surface: '#0F172A',
  surfaceSoft: '#111827',
  surfaceBorder: '#1F2937',
  navBackground: 'rgba(11, 17, 32, 0.94)',
  cardBackground: '#091426',

  bluePrimary: '#1D4ED8',
  blueSecondary: '#DBEAFE',
  purpleAccent: '#7C3AED',
  amberAccent: '#F59E0B',
  greenAccent: '#22C55E',
  redAccent: '#EF4444',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textMuted: '#CBD5E1',

  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBackground: 'rgba(17, 24, 39, 0.6)',
  glassHighlight: 'rgba(255, 255, 255, 0.06)',

  primaryAccent: '#7C3AED',
  secondaryAccent: '#DBEAFE',
  border: '#1F2937',
};

export const lightTheme: Theme = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceSoft: '#EEF2F8',
  surfaceBorder: '#E2E8F0',
  navBackground: 'rgba(255, 255, 255, 0.96)',
  cardBackground: '#FFFFFF',

  bluePrimary: '#1D4ED8',
  blueSecondary: '#DBEAFE',
  purpleAccent: '#7C3AED',
  amberAccent: '#D97706',
  greenAccent: '#16A34A',
  redAccent: '#DC2626',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textMuted: '#334155',

  glassBorder: 'rgba(15, 23, 42, 0.08)',
  glassBackground: 'rgba(255, 255, 255, 0.72)',
  glassHighlight: 'rgba(255, 255, 255, 0.6)',

  primaryAccent: '#7C3AED',
  secondaryAccent: '#DBEAFE',
  border: '#E2E8F0',
};
