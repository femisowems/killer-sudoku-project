import { DIFFICULTY_COUNTS, CAGE_SHAPES } from '../constants/sudoku-constants';

// Pre-compute cell-to-cage map for quick constraint checks
const CELL_TO_CAGE = Array(9).fill(0).map(() => Array(9).fill(-1));
CAGE_SHAPES.forEach((cage, index) => {
    cage.cells.forEach(([r, c]) => {
        CELL_TO_CAGE[r][c] = index;
    });
});

export function generatePuzzle(difficulty, cages) {
    const count = DIFFICULTY_COUNTS[difficulty] || 30;

    // 1. Map cells to their cage index for quick lookup
    const cellToCage = new Array(9).fill(0).map(() => new Array(9).fill(-1));

    // Safety check: if no cages provided (tests or legacy), can't strictly enforce cage rules perfectly here
    // but usually cages will be passed.
    if (cages) {
        cages.forEach((cage, index) => {
            cage.cells.forEach(([r, c]) => {
                cellToCage[r][c] = index;
            });
        });
    }

    // 2. Prepare cage tracking (if cages exist)
    const cageTotalCells = cages ? cages.map(c => c.cells.length) : [];
    const cageRevealedCount = cages ? new Array(cages.length).fill(0) : [];

    const allCells = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            allCells.push([r, c]);
        }
    }

    // Fisher-Yates shuffle
    for (let i = allCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    const selectedCells = [];

    // 3. Select cells with constraint
    for (const [r, c] of allCells) {
        if (selectedCells.length >= count) break;

        const cageIdx = cellToCage[r][c];

        // Check if revealing this cell would fully reveal the cage
        // We allow it ONLY if it's NOT the last hidden cell
        // (Only apply this logic if we have cage data)
        if (cageIdx !== -1 && cages) {
            if (cageRevealedCount[cageIdx] + 1 < cageTotalCells[cageIdx]) {
                // Safe to reveal
                selectedCells.push([r, c]);
                cageRevealedCount[cageIdx]++;
            } else {
                // Skip this cell to keep at least one hidden in the cage
            }
        } else {
            // No cage data or not in cage, just add
            selectedCells.push([r, c]);
        }
    }

    return selectedCells;
}

/**
 * Checks if placing a number is valid according to Sudoku and Killer Sudoku rules
 */
function isValid(board, r, c, num) {
    // 1. Row Check
    for (let i = 0; i < 9; i++) {
        if (board[r][i] === num) return false;
    }

    // 2. Col Check
    for (let i = 0; i < 9; i++) {
        if (board[i][c] === num) return false;
    }

    // 3. Box Check
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    // 4. Killer Cage Uniqueness Check
    // Use the pre-computed global map
    const cageIndex = CELL_TO_CAGE[r][c];
    if (cageIndex !== -1) {
        const cage = CAGE_SHAPES[cageIndex];
        // Check if num exists in any OTHER cell of this cage
        for (const [cr, cc] of cage.cells) {
            // We only care if the cell has a value (is not 0)
            if (board[cr][cc] === num) return false;
        }
    }

    return true;
}

/**
 * Recursively fills the board using randomized backtracking
 */
function solveBoard(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                // Try numbers 1-9 in random order for randomness
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                // Fisher-Yates shuffle
                for (let i = nums.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [nums[i], nums[j]] = [nums[j], nums[i]];
                }

                for (const num of nums) {
                    if (isValid(board, r, c, num)) {
                        board[r][c] = num;
                        if (solveBoard(board)) return true;
                        board[r][c] = 0; // Backtrack
                    }
                }
                return false; // No valid number found for this cell
            }
        }
    }
    return true; // Board full
}

/**
 * Generates a completely new valid Sudoku board from scratch.
 * @returns {number[][]} 9x9 valid Sudoku grid
 */
export function generateValidBoard() {
    // Create new empty 9x9 board
    const board = Array(9).fill(0).map(() => Array(9).fill(0));

    // Fill it with valid numbers
    if (solveBoard(board)) {
        return board;
    } else {
        // Fallback (extremely unlikely for an empty board)
        console.error("Failed to generate a valid board. This should not happen.");
        return board; // Will be incomplete/empty, suggesting serious logic error
    }
}
