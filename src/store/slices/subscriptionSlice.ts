import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, PlanType, SubscriptionLimits, FREE_LIMITS, PLUS_LIMITS } from '../../types/subscription.types';

interface SubscriptionState {
  subscription: Subscription | null;
  limits: SubscriptionLimits;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  limits: FREE_LIMITS,
  isLoading: false,
  error: null,
};

export const fetchSubscription = createAsyncThunk(
  'subscription/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
      state.limits = action.payload.plan === 'free' ? FREE_LIMITS : PLUS_LIMITS;
    },
    upgradePlan: (state, action: PayloadAction<PlanType>) => {
      if (state.subscription) {
        state.subscription.plan = action.payload;
        state.subscription.status = 'active';
        state.limits = PLUS_LIMITS;
      }
    },
    cancelSubscription: (state) => {
      if (state.subscription) {
        state.subscription.status = 'cancelled';
        state.subscription.cancelledAt = new Date().toISOString();
      }
    },
    checkExpiry: (state) => {
      if (state.subscription && state.subscription.expiresAt) {
        const now = new Date();
        const expires = new Date(state.subscription.expiresAt);
        if (now > expires) {
          state.subscription.status = 'expired';
          state.limits = FREE_LIMITS;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload;
        state.limits = action.payload?.plan === 'free' ? FREE_LIMITS : PLUS_LIMITS;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSubscription, upgradePlan, cancelSubscription, checkExpiry, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

// Import supabase at the top
import { supabase } from '../../config/supabase.config';
