export const lightColors = {
  background: '#FBF6EF',
  surface: '#FFF9F3',
  surfaceMuted: '#F2EBE1',
  text: '#3B3230',
  textSecondary: '#8A7668',
  textMuted: '#BBA998',
  accent: '#9B6B42',
  accentLight: '#D4AD82',
  border: '#EDE4D8',
  observation: '#B09070',
  reflection: '#7E96A3',
  success: '#7A9B6D',
  white: '#FFFCF8',
};

export const darkColors = {
  background: '#1A1614',
  surface: '#262120',
  surfaceMuted: '#332D2A',
  text: '#E8E0D8',
  textSecondary: '#A89888',
  textMuted: '#706050',
  accent: '#D4AD82',
  accentLight: '#9B6B42',
  border: '#3D3530',
  observation: '#C0A888',
  reflection: '#8AAAB8',
  success: '#8AAF7A',
  white: '#E8E0D8',
};

/** Legacy alias — use useTheme() in components instead */
export const colors = lightColors;

export type ColorPalette = typeof lightColors;
