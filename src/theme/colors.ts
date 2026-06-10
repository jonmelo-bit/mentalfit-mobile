// Forte design tokens.
// Palette: dark green canvas with a single warm gold accent, plus a light variant.
// The two palettes share the same keys so theme-aware styles can swap between
// them without touching individual style rules.

export type ThemeColors = {
  bg: string; // page background
  card: string; // card / surface
  elevated: string; // popover / inactive accent surface
  gold: string; // primary accent
  goldMuted: string; // secondary accent
  fg: string; // primary foreground
  fgMuted: string; // secondary / subtext foreground
  border: string;
  borderStrong: string;
  navBg: string; // header / bottom-nav surface
  navFg: string; // header / bottom-nav foreground
};

export const darkColors: ThemeColors = {
  bg: '#1A2318',
  card: '#243024',
  elevated: '#2C3A2C',
  gold: '#C9A84C',
  goldMuted: '#998038',
  fg: '#FFFCFA',
  fgMuted: 'rgba(255, 252, 250, 0.55)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
  navBg: '#243024',
  navFg: '#FFFCFA',
};

export const lightColors: ThemeColors = {
  bg: '#F5F2EC',
  card: '#FFFFFF',
  elevated: '#ECE8DF',
  gold: '#C9A84C',
  goldMuted: '#998038',
  fg: '#1A2318',
  fgMuted: '#5A6A58',
  border: 'rgba(0, 0, 0, 0.08)',
  borderStrong: 'rgba(0, 0, 0, 0.14)',
  // Keep the brand dark-green nav chrome even in light mode.
  navBg: '#1A2318',
  navFg: '#FFFFFF',
};

// Backward-compatible default for modules that are not yet theme-aware.
export const colors = darkColors;
