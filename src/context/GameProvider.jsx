import React from 'react';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { GameContext } from './GameContext';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const PREFS_KEY = 'killer-sudoku-prefs';

export const GameProvider = ({ children }) => {
    // We use the existing hook to manage state
    const gameState = useSudokuGame();
    const { isWon, difficulty, timerSeconds, isAutoSolved } = gameState;

    // --- Statistics State ---
    const [stats, setStats] = React.useState({
        easy: { started: 0, wins: [] },
        medium: { started: 0, wins: [] },
        hard: { started: 0, wins: [] },
        expert: { started: 0, wins: [] }
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

    // Reset Stats
    const resetStats = () => {
        const emptyStats = {
            easy: { started: 0, wins: [] },
            medium: { started: 0, wins: [] },
            hard: { started: 0, wins: [] },
            expert: { started: 0, wins: [] }
        };
        setStats(emptyStats);
        localStorage.setItem('killerSudokuStats', JSON.stringify(emptyStats));
    };

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
        username: 'Guest Player',
        joinDate: null,
        lastActive: null,
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

            // Join Date & Last Active Logic
            const now = new Date().toISOString();
            if (!parsedPrefs.joinDate) {
                parsedPrefs.joinDate = now;
            }
            parsedPrefs.lastActive = now;

            // Defaults merged with saved
            setPreferences(prev => {
                const newPrefs = {
                    ...prev,
                    ...parsedPrefs
                };
                // Persist immediately to save 'lastActive' update
                localStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
                return newPrefs;
            });

        } catch (error) {
            console.error('Failed to load preferences:', error);
        }
    }, []);
    // --- Supabase Sync Logic ---
    const { user } = useAuth();
    // eslint-disable-next-line no-unused-vars
    const [isSyncing, setIsSyncing] = React.useState(false);

    // Initial Load (Local Storage) - Already handled above, but we need to reconcile with Cloud if logged in
    React.useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            setIsSyncing(true);
            try {
                let { data, error } = await supabase
                    .from('profiles')
                    .select('stats, preferences')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching profile:', error);
                }

                if (data) {
                    // Found Cloud Data - Merge or Overwrite?
                    // For simplicity: Cloud wins if it exists, otherwise we assume this is a new device or fresh start.
                    if (data.stats) setStats(data.stats);
                    if (data.preferences) setPreferences(prev => ({ ...prev, ...data.preferences }));
                } else {
                    // No profile exists yet, create one with current local data
                    await supabase.from('profiles').insert({
                        id: user.id,
                        stats: stats,
                        preferences: preferences,
                        updated_at: new Date()
                    });
                }
            } catch (err) {
                console.error("Supabase Sync Error:", err);
            } finally {
                setIsSyncing(false);
            }
        };

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Runs when user logs in

    // Auto-Save to Supabase when stats or preferences change
    // Using a Ref to safely debounce saving to avoid too many writes
    const saveTimeoutRef = React.useRef(null);

    React.useEffect(() => {
        if (!user) return;

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        stats: stats,
                        preferences: preferences,
                        updated_at: new Date()
                    });
                if (error) console.error('Error auto-saving:', error);
            } catch (err) {
                console.error('Save error:', err);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(saveTimeoutRef.current);
    }, [stats, preferences, user]);

    // Persist preferences logic
    const updatePreferences = (updates) => {
        setPreferences(prev => {
            const newPrefs = { ...prev, ...updates };
            localStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
            return newPrefs;
        });
    };

    // Expose individual setters for easier consumption
    const setUsername = (username) => updatePreferences({ username });
    const setTheme = (theme) => updatePreferences({ theme });
    const toggleTimerVisibility = () => updatePreferences({ showTimer: !preferences.showTimer });
    const toggleMistakesVisibility = () => updatePreferences({ showMistakes: !preferences.showMistakes });


    const value = {
        ...gameState,
        startNewGame: startNewGameWrapper,
        stats,
        resetStats,
        // Preferences
        username: preferences.username,
        joinDate: preferences.joinDate,
        lastActive: preferences.lastActive,
        setUsername,
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
