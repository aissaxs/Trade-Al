import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: 'ar' | 'en';
  theme: 'dark' | 'light' | 'system';
  notifications: {
    marketAlerts: boolean;
    priceAlerts: boolean;
    signalAlerts: boolean;
    newsAlerts: boolean;
    tradeAlerts: boolean;
    sound: boolean;
    vibration: boolean;
  };
  chartSettings: {
    type: 'candlestick' | 'line' | 'area';
    timeframe: string;
    indicators: string[];
  };
}

const initialState: SettingsState = {
  language: 'ar',
  theme: 'dark',
  notifications: {
    marketAlerts: true,
    priceAlerts: true,
    signalAlerts: true,
    newsAlerts: true,
    tradeAlerts: true,
    sound: true,
    vibration: true,
  },
  chartSettings: {
    type: 'candlestick',
    timeframe: '1h',
    indicators: ['ema', 'rsi'],
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'system'>) => {
      state.theme = action.payload;
    },
    toggleNotification: (state, action: PayloadAction<keyof SettingsState['notifications']>) => {
      state.notifications[action.payload] = !state.notifications[action.payload];
    },
    setChartType: (state, action: PayloadAction<SettingsState['chartSettings']['type']>) => {
      state.chartSettings.type = action.payload;
    },
    setTimeframe: (state, action: PayloadAction<string>) => {
      state.chartSettings.timeframe = action.payload;
    },
    toggleIndicator: (state, action: PayloadAction<string>) => {
      const index = state.chartSettings.indicators.indexOf(action.payload);
      if (index >= 0) {
        state.chartSettings.indicators.splice(index, 1);
      } else {
        state.chartSettings.indicators.push(action.payload);
      }
    },
    resetSettings: () => initialState,
  },
});

export const {
  setLanguage,
  setTheme,
  toggleNotification,
  setChartType,
  setTimeframe,
  toggleIndicator,
  resetSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
