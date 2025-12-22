
import React, { createContext, useContext } from 'react';
import { useSudokuGame } from '../hooks/useSudokuGame';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    // We use the existing hook to manage state
    const gameState = useSudokuGame();

    // Wrap startNewGame to track stats
    const startNewGameWrapper = (diff) => {
        // Track game start
        try {
            const currentStats = JSON.parse(localStorage.getItem('killerSudokuStats') || '{"easy":{"started":0,"wins":[]},"medium":{"started":0,"wins":[]},"hard":{"started":0,"wins":[]}}');
            // Ensure structure exists (migration)
            if (!currentStats[diff]) currentStats[diff] = { started: 0, wins: [] };

            currentStats[diff].started += 1;
            localStorage.setItem('killerSudokuStats', JSON.stringify(currentStats));
        } catch (e) {
            console.error("Failed to update stats", e);
        }

        // Call original
        gameState.startNewGame(diff);
    };

    const value = {
        ...gameState,
        startNewGame: startNewGameWrapper
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
