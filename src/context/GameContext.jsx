
import React, { createContext, useContext } from 'react';
import { useSudokuGame } from '../hooks/useSudokuGame';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    // We use the existing hook to manage state
    const gameState = useSudokuGame();

    return (
        <GameContext.Provider value={gameState}>
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
