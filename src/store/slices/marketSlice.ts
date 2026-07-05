import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ticker, Candlestick, TrendAnalysis } from '../../types/market.types';
import { getPrice, get24hStats, getCandles } from '../../services/api/binanceApi';

interface MarketState {
  tickers: Ticker[];
  selectedSymbol: string;
  candles: Candlestick[];
  trend: TrendAnalysis | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
}

const initialState: MarketState = {
  tickers: [],
  selectedSymbol: 'BTCUSDT',
  candles: [],
  trend: null,
  isLoading: false,
  error: null,
  lastUpdate: 0,
};

export const fetchTicker = createAsyncThunk(
  'market/fetchTicker',
  async (symbol: string, { rejectWithValue }) => {
    try {
      const data = await get24hStats(symbol);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCandles = createAsyncThunk(
  'market/fetchCandles',
  async ({ symbol, interval }: { symbol: string; interval: string }, { rejectWithValue }) => {
    try {
      const data = await getCandles(symbol, interval);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setSelectedSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload;
    },
    updateTicker: (state, action: PayloadAction<Ticker>) => {
      const index = state.tickers.findIndex(t => t.symbol === action.payload.symbol);
      if (index >= 0) {
        state.tickers[index] = action.payload;
      } else {
        state.tickers.push(action.payload);
      }
    },
    setTrend: (state, action: PayloadAction<TrendAnalysis>) => {
      state.trend = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTicker.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tickers.findIndex(t => t.symbol === action.payload.symbol);
        if (index >= 0) {
          state.tickers[index] = action.payload;
        } else {
          state.tickers.push(action.payload);
        }
        state.lastUpdate = Date.now();
      })
      .addCase(fetchTicker.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCandles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCandles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candles = action.payload;
      })
      .addCase(fetchCandles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSymbol, updateTicker, setTrend, clearError } = marketSlice.actions;
export default marketSlice.reducer;
