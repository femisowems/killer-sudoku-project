import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialSeconds = 0) => {
    const [timerSeconds, setTimerSeconds] = useState(initialSeconds);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && !isPaused) {
            interval = setInterval(() => {
                setTimerSeconds(s => s + 1);
            }, 1000);
        } else if ((!isTimerRunning || isPaused) && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, isPaused]);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setTimerSeconds(0);
        setIsTimerRunning(true);
        setIsPaused(false);
    }, []);

    const stopTimer = useCallback(() => {
        setIsTimerRunning(false);
    }, []);

    const startTimer = useCallback(() => {
        setIsTimerRunning(true);
        setIsPaused(false);
    }, []);

    return {
        timerSeconds,
        isTimerRunning,
        isPaused,
        setIsPaused,
        togglePause,
        resetTimer,
        stopTimer,
        startTimer,
        setTimerSeconds
    };
};
