import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIMessage, AIChatSession, AISignal } from '../../types/ai.types';
import { askAI, analyzeImage } from '../../services/ai/geminiApi';

interface AIState {
  sessions: AIChatSession[];
  currentSession: AIChatSession | null;
  signals: AISignal[];
  isLoading: boolean;
  error: string | null;
  dailyImageCount: number;
  lastImageReset: number;
}

const initialState: AIState = {
  sessions: [],
  currentSession: null,
  signals: [],
  isLoading: false,
  error: null,
  dailyImageCount: 0,
  lastImageReset: Date.now(),
};

export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async ({ message, section, imageBase64 }: { 
    message: string; 
    section: 'home' | 'learn' | 'capital' | 'market';
    imageBase64?: string;
  }, { rejectWithValue }) => {
    try {
      let response: string;
      
      if (imageBase64) {
        response = await analyzeImage(imageBase64, message);
      } else {
        response = await askAI(message);
      }
      
      return { message, response, section };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    createSession: (state, action: PayloadAction<{ userId: string; section: string }>) => {
      const newSession: AIChatSession = {
        id: Date.now().toString(),
        userId: action.payload.userId,
        section: action.payload.section as any,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isSaved: false,
      };
      state.sessions.push(newSession);
      state.currentSession = newSession;
    },
    addMessage: (state, action: PayloadAction<{ sessionId: string; message: AIMessage }>) => {
      const session = state.sessions.find(s => s.id === action.payload.sessionId);
      if (session) {
        session.messages.push(action.payload.message);
        session.updatedAt = Date.now();
      }
    },
    saveSession: (state, action: PayloadAction<string>) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.isSaved = true;
      }
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
    },
    setCurrentSession: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.currentSession = state.sessions.find(s => s.id === action.payload) || null;
      } else {
        state.currentSession = null;
      }
    },
    incrementImageCount: (state) => {
      state.dailyImageCount += 1;
    },
    resetImageCount: (state) => {
      state.dailyImageCount = 0;
      state.lastImageReset = Date.now();
    },
    addSignal: (state, action: PayloadAction<AISignal>) => {
      state.signals.unshift(action.payload);
      if (state.signals.length > 100) {
        state.signals.pop();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { message, response, section } = action.payload;
        
        if (state.currentSession) {
          state.currentSession.messages.push({
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: Date.now(),
          });
          state.currentSession.messages.push({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: Date.now(),
          });
          state.currentSession.updatedAt = Date.now();
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  createSession,
  addMessage,
  saveSession,
  deleteSession,
  setCurrentSession,
  incrementImageCount,
  resetImageCount,
  addSignal,
  clearError,
} = aiSlice.actions;
export default aiSlice.reducer;
