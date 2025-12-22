
import React, { createContext, useContext } from 'react';

// Export the Context object so GameProvider can import it
export const GameContext = createContext(null);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
