
const STORAGE_KEY = 'killer-sudoku-state';

/**
 * Saves the current game state to local storage.
 * @param {Object} state - The game state object.
 */
export const saveGameState = (state) => {
    try {
        // Convert Sets (for Notes) to Arrays for JSON serialization
        const serializedState = {
            ...state,
            notes: state.notes.map(row =>
                row.map(cellNotes => Array.from(cellNotes))
            ),
            lastSaved: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedState));
    } catch (error) {
        console.error('Failed to save game state:', error);
    }
};

/**
 * Loads the game state from local storage.
 * @returns {Object|null} The saved state or null if not found/invalid.
 */
export const loadGameState = () => {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return null;

        const state = JSON.parse(json);

        // Convert Arrays back to Sets for Notes
        if (state.notes) {
            state.notes = state.notes.map(row =>
                row.map(cellNotesArr => new Set(cellNotesArr))
            );
        }

        return state;
    } catch (error) {
        console.error('Failed to load game state:', error);
        return null;
    }
};

/**
 * Clears the saved game state.
 */
export const clearGameState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear game state:', error);
    }
};
