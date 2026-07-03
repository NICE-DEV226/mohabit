/**
 * THÈME — source unique des couleurs et polices.
 *
 * Importé à la fois par `tailwind.config.ts` (génération des classes utilitaires)
 * et par l'application. Pour re-skinner le site pour un autre client, il suffit
 * de modifier les valeurs ci-dessous : aucune couleur n'est codée en dur ailleurs.
 */

export const themeColors = {
  black: '#0A0A0A',
  gold: {
    DEFAULT: '#F5A623',
    50: '#FEF3D9',
    100: '#FDE8B3',
    200: '#FBD180',
    400: '#F5A623',
    500: '#F5A623',
    600: '#D4890E',
    700: '#B36E09',
  },
  blue: {
    DEFAULT: '#1E90FF',
    400: '#1E90FF',
    500: '#1E90FF',
    600: '#1873CC',
  },
  grey: {
    dark: '#1A1A1A',
    mid: '#2C2C2C',
    text: '#A0A0A0',
  },
} as const

export const themeFonts = {
  display: ['Bebas Neue', 'sans-serif'],
  sans: ['DM Sans', 'system-ui', 'sans-serif'],
  mono: ['Space Mono', 'monospace'],
}
