import { useState, useCallback } from 'react';

export const useHistory = (initialHistory = [], initialFuture = []) => {
    const [history, setHistory] = useState(initialHistory);
    const [future, setFuture] = useState(initialFuture);

    const addToHistory = useCallback((currentState) => {
        setHistory(prev => [...prev, currentState]);
        setFuture([]); // Clear future on new move
    }, []);

    const handleUndo = useCallback((currentState, isPaused, isWon) => {
        if (!isPaused && !isWon && history.length > 0) {
            const previousState = history[history.length - 1];
            const newHistory = history.slice(0, -1);

            // Save current state to future
            setFuture(prev => [currentState, ...prev]);

            // Update history
            setHistory(newHistory);

            return previousState;
        }
        return null;
    }, [history]);

    const handleRedo = useCallback((currentState, isPaused, isWon) => {
        if (!isPaused && !isWon && future.length > 0) {
            const nextState = future[0];
            const newFuture = future.slice(1);

            // Save current state to history
            setHistory(prev => [...prev, currentState]);

            // Update future
            setFuture(newFuture);

            return nextState;
        }
        return null;
    }, [future]);

    const resetHistory = useCallback(() => {
        setHistory([]);
        setFuture([]);
    }, []);

    return {
        history,
        future,
        addToHistory,
        handleUndo,
        handleRedo,
        resetHistory,
        setHistory, // Added for loading saved state
        setFuture
    };
};
