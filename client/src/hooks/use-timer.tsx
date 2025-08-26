import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number;
}

export function useTimer(initialTime: number = 25 * 60) {
  const [timer, setTimer] = useState<TimerState>({
    timeLeft: initialTime,
    isRunning: false,
    isPaused: false,
    totalTime: initialTime,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: false, isPaused: true }));
  }, []);

  const reset = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      timeLeft: prev.totalTime,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  const setTime = useCallback((time: number) => {
    setTimer(prev => ({
      ...prev,
      timeLeft: time,
      totalTime: time,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  useEffect(() => {
    if (timer.isRunning && timer.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            return {
              ...prev,
              timeLeft: 0,
              isRunning: false,
              isPaused: false,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const progress = timer.totalTime > 0 ? (timer.totalTime - timer.timeLeft) / timer.totalTime : 0;

  return {
    timeLeft: timer.timeLeft,
    formattedTime: formatTime(timer.timeLeft),
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    progress,
    start,
    pause,
    reset,
    setTime,
  };
}
