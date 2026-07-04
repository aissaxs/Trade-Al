import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export const API_CONFIG = {
  BINANCE_BASE_URL: 'https://api.binance.com',
  BINANCE_WS_URL: 'wss://stream.binance.com:9443/ws',
  BINANCE_API_KEY: process.env.BINANCE_API_KEY || '',
  BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY || '',
  
  SUPABASE_URL: process.env.SUPABASE_URL || extra.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || extra.SUPABASE_ANON_KEY || '',
  
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: 'gemini-1.5-pro',
  GEMINI_FLASH_MODEL: 'gemini-1.5-flash',
  
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: 'llama3-70b-8192',
  GROQ_FAST_MODEL: 'llama3-8b-8192',
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  
  APP_VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  WS_RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
};

export const ENDPOINTS = {
  BINANCE_TICKER: '/api/v3/ticker/price',
  BINANCE_24H: '/api/v3/ticker/24hr',
  BINANCE_KLINES: '/api/v3/klines',
  BINANCE_DEPTH: '/api/v3/depth',
  BINANCE_TRADES: '/api/v3/trades',
  
  SUPABASE_SIGNUP: '/auth/v1/signup',
  SUPABASE_SIGNIN: '/auth/v1/token?grant_type=password',
  SUPABASE_SIGNOUT: '/auth/v1/logout',
  SUPABASE_USER: '/auth/v1/user',
  SUPABASE_REFRESH: '/auth/v1/token?grant_type=refresh_token',
  
  SUPABASE_REST: '/rest/v1',
};
