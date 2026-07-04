import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, createSession, incrementImageCount } from '../store/slices/aiSlice';
import { RootState } from '../store/store';
import { useAuth } from './useAuth';
import { useSubscription } from '../context/SubscriptionContext';

export function useAI(section: 'home' | 'learn' | 'capital' | 'market') {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { canUseAIChat } = useSubscription();
  const { currentSession, isLoading, error, dailyImageCount } = useSelector((state: RootState) => state.ai);

  const [messages, setMessages] = useState<any[]>([]);

  const startSession = useCallback(() => {
    if (user) {
      dispatch(createSession({ userId: user.id, section }) as any);
    }
  }, [dispatch, user, section]);

  const sendChatMessage = useCallback(async (message: string, imageBase64?: string) => {
    if (!canUseAIChat(section)) {
      throw new Error('هذه الميزة متاحة فقط لمشتركي Plus');
    }

    if (imageBase64 && dailyImageCount >= 3) {
      throw new Error('لقد تجاوزت الحد اليومي للصور (3). اشترك في Plus لصور غير محدودة.');
    }

    try {
      const result = await dispatch(sendMessage({
        message,
        section,
        imageBase64,
      }) as any);

      if (imageBase64) {
        dispatch(incrementImageCount());
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'فشل في إرسال الرسالة');
    }
  }, [dispatch, section, canUseAIChat, dailyImageCount]);

  return {
    messages: currentSession?.messages || [],
    isLoading,
    error,
    dailyImageCount,
    startSession,
    sendChatMessage,
  };
}
