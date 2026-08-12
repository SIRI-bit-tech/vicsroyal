// Centralized Brand Colors
export const BRAND_COLORS = {
  BG_DARK: '#0A0A0A',
  BG_MAROON: '#2B0A1F',
  TEXT_LIGHT: '#FFFFFF',
  PRIMARY_PINK: '#E6007E',
  LIGHT_PINK: '#FF4FA0',
  ACCENT_TEAL: '#1E9E7C',
} as const;

// Environment Variable Keys
export const ENV_KEYS = {
  WHATSAPP_NUMBER: 'NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER',
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  UPLOADTHING_TOKEN: 'UPLOADTHING_TOKEN',
} as const;

// Default Admin WhatsApp Number if env is not set
export const DEFAULT_WHATSAPP_NUMBER = '2348000000000';

// Animation Performance Ceilings & Settings (Motion Design Rules)
export const MOTION_CONFIG = {
  UI_DURATION: 0.3,
  TRANSITION_DURATION: 0.5,
  STAGGER_DELAY: 0.05,
} as const;

// Category Constants
export const CATEGORY_SLUGS = {
  WIGS: 'wigs',
  BUNDLES: 'bundles',
  CLOSURES: 'closures',
  EXTENSIONS: 'extensions',
  ACCESSORIES: 'accessories',
} as const;

// Auth Session Configuration
export const AUTH_CONFIG = {
  COOKIE_NAME: 'vic_royal_admin_session',
  TOKEN_MAX_AGE_SECONDS: 60 * 60 * 24 * 7, // 7 days
} as const;

// Local Cart Key
export const CART_STORAGE_KEY = 'vic_royal_cart_items_v1';
export const SESSION_ID_KEY = 'vic_royal_anon_session_id';
