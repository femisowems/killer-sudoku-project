
import React from 'react';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { GameContext } from './GameContext';

export const GameProvider = ({ children }) => {
    // We use the existing hook to manage state
    const gameState = useSudokuGame();
    const { isWon, difficulty, timerSeconds, isAutoSolved } = gameState;

    // Statistics State
    const [stats, setStats] = React.useState({
        easy: { started: 0, wins: [] },
        medium: { started: 0, wins: [] },
        hard: { started: 0, wins: [] }
    });

    // Load stats on mount
    React.useEffect(() => {
        const savedStats = localStorage.getItem('killerSudokuStats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        } else {
            // Migration support
            const oldBest = localStorage.getItem('killerSudokuBestTimes');
            if (oldBest) {
                const parsedBest = JSON.parse(oldBest);
                const newStats = {
                    easy: { started: parsedBest.easy ? 1 : 0, wins: parsedBest.easy ? [parsedBest.easy] : [] },
                    medium: { started: parsedBest.medium ? 1 : 0, wins: parsedBest.medium ? [parsedBest.medium] : [] },
                    hard: { started: parsedBest.hard ? 1 : 0, wins: parsedBest.hard ? [parsedBest.hard] : [] }
                };
                setStats(newStats);
                localStorage.setItem('killerSudokuStats', JSON.stringify(newStats));
            }
        }
    }, []);

    // Wrap startNewGame to track stats (Games Started)
    const startNewGameWrapper = (diff) => {
        setStats(prev => {
            const currentStats = { ...prev };
            // Ensure structure exists
            if (!currentStats[diff]) currentStats[diff] = { started: 0, wins: [] };

            currentStats[diff] = {
                ...currentStats[diff],
                started: currentStats[diff].started + 1
            };

            localStorage.setItem('killerSudokuStats', JSON.stringify(currentStats));
            return currentStats;
        });

        // Call original
        gameState.startNewGame(diff);
    };

    // Track Wins
    React.useEffect(() => {
        if (isWon && !isAutoSolved) {
            setStats(prev => {
                const currentDiffStats = prev[difficulty] || { started: 1, wins: [] };
                const lastWin = currentDiffStats.wins[currentDiffStats.wins.length - 1];

                // Prevent duplicates (simple check against last win time)
                if (lastWin === timerSeconds) return prev;

                const newStats = {
                    ...prev,
                    [difficulty]: {
                        ...currentDiffStats,
                        wins: [...currentDiffStats.wins, timerSeconds]
                    }
                };
                localStorage.setItem('killerSudokuStats', JSON.stringify(newStats));
                return newStats;
            });
        }
    }, [isWon, difficulty, timerSeconds, isAutoSolved]);

    // Theme State
    const [theme, setTheme] = React.useState('platinum');

    // Load theme on mount
    React.useEffect(() => {
        const savedTheme = localStorage.getItem('killerSudokuTheme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const updatedSetTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('killerSudokuTheme', newTheme);
    };

    const value = {
        ...gameState,
        startNewGame: startNewGameWrapper,
        stats,
        theme,
        setTheme: updatedSetTheme
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};


