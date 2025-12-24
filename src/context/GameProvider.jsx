import React from 'react';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { GameContext } from './GameContext';

const PREFS_KEY = 'killer-sudoku-prefs';

export const GameProvider = ({ children }) => {
    // We use the existing hook to manage state
    const gameState = useSudokuGame();
    const { isWon, difficulty, timerSeconds, isAutoSolved } = gameState;

    // --- Statistics State ---
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


    // --- Preferences State (Theme, Timer Visibility, Mistake Visibility) ---
    const [preferences, setPreferences] = React.useState({
        theme: 'platinum',
        showTimer: true,
        showMistakes: true
    });

    // Load preferences on mount
    React.useEffect(() => {
        try {
            const savedPrefs = localStorage.getItem(PREFS_KEY);
            let parsedPrefs = savedPrefs ? JSON.parse(savedPrefs) : {};

            // Migration: Check legacy theme key if not in prefs
            if (!parsedPrefs.theme) {
                const legacyTheme = localStorage.getItem('killerSudokuTheme');
                if (legacyTheme) {
                    parsedPrefs.theme = legacyTheme;
                    // Clean up legacy key
                    localStorage.removeItem('killerSudokuTheme');
                }
            }

            // Defaults merged with saved
            setPreferences(prev => ({
                ...prev,
                ...parsedPrefs
            }));
        } catch (error) {
            console.error('Failed to load preferences:', error);
        }
    }, []);

    // Persist preferences logic
    const updatePreferences = (updates) => {
        setPreferences(prev => {
            const newPrefs = { ...prev, ...updates };
            localStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
            return newPrefs;
        });
    };

    // Expose individual setters for easier consumption
    const setTheme = (theme) => updatePreferences({ theme });
    const toggleTimerVisibility = () => updatePreferences({ showTimer: !preferences.showTimer });
    const toggleMistakesVisibility = () => updatePreferences({ showMistakes: !preferences.showMistakes });


    const value = {
        ...gameState,
        startNewGame: startNewGameWrapper,
        stats,
        // Preferences
        theme: preferences.theme,
        setTheme,
        showTimer: preferences.showTimer,
        toggleTimerVisibility,
        showMistakes: preferences.showMistakes,
        toggleMistakesVisibility
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};


