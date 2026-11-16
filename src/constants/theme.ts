/**
 * Visual preset: CANDY_SWEET (design-system preset), with the brief's palette
 * overrides applied on top (parchment pink / berry / lime / ink).
 * The preset identifier itself is never renamed.
 */
export const theme = {
  name: 'candy-sweet',

  colors: {
    bg: {
      primary: '#F6EDF1',
      secondary: '#FFFFFF',
      tertiary: '#F8E8F0',
      accent: '#FFE0EB',
    },
    brand: {
      berry: '#AB2A66',
      lime: '#81E028',
      ink: '#24181E',
      paper: '#DDB1B0',
    },
    candy: {
      pink: '#FFE0EB',
      rose: '#DDB1B0',
      blush: '#F8E8F0',
      parchment: '#F6EDF1',
      berry: '#AB2A66',
      lime: '#81E028',
    },
    text: {
      primary: '#24181E',
      secondary: '#AB2A66',
      muted: 'rgba(36, 24, 30, 0.72)',
      faint: 'rgba(36, 24, 30, 0.52)',
      onDark: '#FFFFFF',
      onPaper: '#F6EDF1',
    },
    ui: {
      border: '#DDB1B0',
      borderSoft: 'rgba(221, 177, 176, 0.55)',
      divider: 'rgba(221, 177, 176, 0.42)',
      overlay: 'rgba(36, 24, 30, 0.32)',
      scrim: 'rgba(36, 24, 30, 0.58)',
      glass: 'rgba(255, 255, 255, 0.92)',
      limeSoft: 'rgba(129, 224, 40, 0.18)',
      berrySoft: 'rgba(171, 42, 102, 0.12)',
    },
  },

  gradients: {
    loader: ['#24181E', '#5E2340', '#AB2A66'] as string[],
    menu: ['#F6EDF1', '#F8E8F0', '#FFE0EB'] as string[],
    game: ['#F6EDF1', '#FFFFFF', '#F8E8F0'] as string[],
    result: ['#FFE0EB', '#F6EDF1', '#FFFFFF'] as string[],
    records: ['#F6EDF1', '#FFFFFF', '#F8E8F0'] as string[],
    settings: ['#F8E8F0', '#F6EDF1', '#FFFFFF'] as string[],
    board: ['#FFFFFF', '#F6EDF1'] as string[],
    primary: ['#81E028', '#B6E86F'] as string[],
    berry: ['#AB2A66', '#D4578C'] as string[],
    dock: ['#FFFFFF', '#FFE0EB'] as string[],
    sheet: ['#FFFFFF', '#F6EDF1'] as string[],
  },

  typography: {
    hero: { fontSize: 40, lineHeight: 44, fontWeight: '800' as const, letterSpacing: 0.2 },
    title: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const, letterSpacing: 0 },
    titleCompact: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: 0 },
    section: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, letterSpacing: 0 },
    body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const, letterSpacing: 0 },
    instruction: { fontSize: 15, lineHeight: 21, fontWeight: '500' as const, letterSpacing: 0 },
    cardLabel: { fontSize: 15, lineHeight: 18, fontWeight: '700' as const, letterSpacing: 0 },
    button: { fontSize: 18, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.6 },
    buttonSmall: { fontSize: 15, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.4 },
    value: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: 0 },
    clock: { fontSize: 18, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.4 },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.3 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  radius: { sm: 10, md: 16, lg: 18, xl: 24, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#24181E',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    },
    raised: {
      shadowColor: '#24181E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    cta: {
      shadowColor: '#AB2A66',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 4,
    },
    dock: {
      shadowColor: '#24181E',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 14,
      elevation: 6,
    },
  },

  animation: {
    press: { tension: 180, friction: 16 },
    settle: { tension: 120, friction: 9 },
    fast: 150,
    normal: 200,
    sheet: 180,
    reduced: 100,
  },
};

export type Theme = typeof theme;
export default theme;
