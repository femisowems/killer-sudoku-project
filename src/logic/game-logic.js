
/**
 * Calculates the new state of notes after a user inputs a number.
 * Handles the "Smart Notes" feature: removing the inputted number from related row, col, block, and cage.
 * 
 * @param {Array<Array<Set<number>>>} notes - Current notes grid
 * @param {number} r - Row index (0-8)
 * @param {number} c - Col index (0-8)
 * @param {number} number - The number entered (1-9)
 * @param {Array<Array<number>>} cellToCageIndex - Map of cell coords to cage index
 * @param {Array<object>} cages - Array of cage objects
 * @returns {Array<Array<Set<number>>>} New notes grid
 */
export function calculateSmartNoteUpdates(notes, r, c, number, cellToCageIndex, cages) {
    // Deep copy notes to avoid mutation
    const newNotes = notes.map(row => row.map(set => new Set(set)));

    // 1. Clear this cell's notes
    newNotes[r][c].clear();

    if (number === 0) return newNotes;

    // Helper to remove number from a specific cell's notes
    const removeNote = (row, col) => {
        if (newNotes[row][col].has(number)) {
            newNotes[row][col].delete(number);
        }
    };

    // 2. Clear from Row and Column
    for (let i = 0; i < 9; i++) {
        removeNote(r, i); // Row
        removeNote(i, c); // Column
    }

    // 3. Clear from 3x3 Block
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            removeNote(startRow + i, startCol + j);
        }
    }

    // 4. Clear from Cage
    const cageIdx = cellToCageIndex[r][c];
    if (cageIdx !== -1) {
        cages[cageIdx].cells.forEach(([cr, cc]) => {
            removeNote(cr, cc);
        });
    }

    return newNotes;
}
