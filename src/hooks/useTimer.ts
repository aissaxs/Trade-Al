import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isExpired: boolean;
}

export function useTimer(initialMinutes: number = 30) {
  const [state, setState] = useState<TimerState>({
    timeLeft: initialMinutes * 60,
    isRunning: false,
    isExpired: false,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, isExpired: false }));
    
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return { timeLeft: 0, isRunning: false, isExpired: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback((minutes: number = initialMinutes) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState({
      timeLeft: minutes * 60,
      isRunning: false,
      isExpired: false,
    });
  }, [initialMinutes]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    formattedTime: formatTime(state.timeLeft),
    start,
    stop,
    reset,
  };
}
