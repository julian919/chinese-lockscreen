export const COLORS = {
  // Base Backgrounds
  background: '#0B0F19',       // Deep Obsidian Dark Mode
  surface: '#1E293B',          // Glass Slate Card Surface
  surfaceLight: '#334155',     // Elevated Glass Border / Surface
  
  // Accents & Functional
  primary: '#F59E0B',          // Warm Gold / Amber (Headers, Streaks, XP)
  primaryLight: '#FEF3C7',
  primaryBg: 'rgba(245, 158, 11, 0.15)',
  secondary: '#6366F1',        // Indigo (Quizzes, Secondary CTAs)
  
  // Feedback
  success: '#10B981',          // Emerald Green (Swipe Right / Easy / Mastered)
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: '#F43F5E',          // Rose Red (Swipe Left / Review / Hard)
  warningBg: 'rgba(244, 63, 94, 0.15)',
  
  // Typography
  text: '#F8FAFC',             // Pure White / High Contrast
  textSecondary: '#94A3B8',    // Muted Gray (English translations / meta)
  pinyin: '#38BDF8',           // Sky Blue (Distinct Pinyin phonetic separation)
  
  // Borders & Glass
  border: 'rgba(255, 255, 255, 0.1)',
  glassBg: 'rgba(30, 41, 59, 0.75)',
};

export const SIZES = {
  // Mobile Touch Metrics (Minimum 48px per touch-psychology.md)
  minTouchTarget: 48,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border Radius
  radiusSm: 8,
  radiusMd: 16,
  radiusLg: 24,
  radiusPill: 999,
};

export const FONTS = {
  hanziLg: {
    fontSize: 52,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  hanziMd: {
    fontSize: 36,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  pinyinLg: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: COLORS.pinyin,
  },
  pinyinMd: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: COLORS.pinyin,
  },
  english: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.text,
  },
};
