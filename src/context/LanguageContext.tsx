import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../utils/i18n';

interface LanguageContextType {
  language: 'ar' | 'en';
  isRTL: boolean;
  setLanguage: (lang: 'ar' | 'en') => Promise<void>;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const isRTL = language === 'ar';

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) {
        setLanguageState(savedLang as 'ar' | 'en');
        i18n.locale = savedLang;
      }
    } catch (error) {
      console.error('Load language error:', error);
    }
  };

  const setLanguage = async (lang: 'ar' | 'en') => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
      i18n.locale = lang;
    } catch (error) {
      console.error('Set language error:', error);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    return i18n.t(key, params);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      isRTL,
      setLanguage,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
