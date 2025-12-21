
// Valid seed board (standard completed grid)
const SEED_BOARD = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4],
    [3, 1, 2, 6, 4, 5, 9, 7, 8],
    [6, 4, 5, 9, 7, 8, 3, 1, 2],
    [9, 7, 8, 3, 1, 2, 6, 4, 5]
];

export const CAGE_SHAPES = [
    { cells: [[0, 0], [0, 1], [0, 2]] },
    { cells: [[0, 3], [1, 3]] },
    { cells: [[0, 4], [1, 4], [2, 4], [3, 4]] },
    { cells: [[0, 5], [1, 5]] },
    { cells: [[0, 6], [1, 6]] },
    { cells: [[0, 7], [1, 7]] },
    { cells: [[0, 8], [1, 8], [2, 8]] },

    { cells: [[1, 0], [2, 0], [2, 1]] },
    { cells: [[1, 1], [1, 2]] },
    { cells: [[2, 2], [3, 2]] },
    { cells: [[2, 3], [3, 3]] },
    { cells: [[2, 5], [3, 5]] },
    { cells: [[2, 6], [3, 6]] },
    { cells: [[2, 7], [3, 7], [4, 7]] },

    { cells: [[3, 0], [4, 0]] },
    { cells: [[3, 1], [4, 1], [4, 2]] },
    { cells: [[3, 8], [4, 8]] },

    { cells: [[4, 3], [4, 4], [5, 3]] },
    { cells: [[4, 5], [5, 5]] },
    { cells: [[4, 6], [5, 6]] },

    { cells: [[5, 0], [6, 0], [6, 1]] },
    { cells: [[5, 1], [5, 2]] },
    { cells: [[5, 4], [6, 4]] },
    { cells: [[5, 7], [6, 7]] },
    { cells: [[5, 8], [6, 8], [7, 8]] },

    { cells: [[6, 2], [7, 2], [6, 3]] },
    { cells: [[7, 3], [7, 4]] },
    { cells: [[6, 5], [7, 5]] },
    { cells: [[6, 6], [7, 6]] },

    { cells: [[7, 0], [7, 1], [8, 1], [8, 0]] },
    { cells: [[7, 7]] },

    { cells: [[8, 2], [8, 3], [8, 4]] },
    { cells: [[8, 5], [8, 6]] },
    { cells: [[8, 7], [8, 8]] }
];

export const DIFFICULTY_COUNTS = {
    easy: 30,
    medium: 20,
    hard: 10
};

export function generatePuzzle(difficulty) {
    const count = DIFFICULTY_COUNTS[difficulty] || 30;
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

    return allCells.slice(0, count);
}

// Helper to swap two rows
function swapRows(board, r1, r2) {
    const temp = board[r1];
    board[r1] = board[r2];
    board[r2] = temp;
}

// Helper to swap two columns
function swapCols(board, c1, c2) {
    for (let i = 0; i < 9; i++) {
        const temp = board[i][c1];
        board[i][c1] = board[i][c2];
        board[i][c2] = temp;
    }
}

// Helper to transpose board
function transpose(board) {
    const newBoard = Array(9).fill(0).map(() => Array(9).fill(0));
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            newBoard[c][r] = board[r][c];
        }
    }
    return newBoard;
}

// Generate a randomised valid board from the seed
export function generateValidBoard() {
    // Deep copy seed
    let board = JSON.parse(JSON.stringify(SEED_BOARD));

    // 1. Shuffle Row Groups
    if (Math.random() > 0.5) { // Swap band 0 and 1
        for (let i = 0; i < 3; i++) swapRows(board, i, i + 3);
    }
    if (Math.random() > 0.5) { // Swap band 1 and 2
        for (let i = 0; i < 3; i++) swapRows(board, i + 3, i + 6);
    }

    // 2. Shuffle Rows within bands
    for (let b = 0; b < 3; b++) {
        if (Math.random() > 0.5) swapRows(board, b * 3, b * 3 + 1);
        if (Math.random() > 0.5) swapRows(board, b * 3 + 1, b * 3 + 2);
        if (Math.random() > 0.5) swapRows(board, b * 3, b * 3 + 2);
    }

    // 3. Shuffle Columns within bands
    for (let b = 0; b < 3; b++) {
        if (Math.random() > 0.5) swapCols(board, b * 3, b * 3 + 1);
        if (Math.random() > 0.5) swapCols(board, b * 3 + 1, b * 3 + 2);
        if (Math.random() > 0.5) swapCols(board, b * 3, b * 3 + 2);
    }

    // 4. Randomly Transpose
    if (Math.random() > 0.5) {
        board = transpose(board);
    }

    return board;
}

export function isStandardConflict(board, r, c) {
    const value = board[r][c];
    if (value === 0) return false;

    // 1. Check Row and Column
    for (let i = 0; i < 9; i++) {
        // Check row (skip self)
        if (i !== c && board[r][i] === value) return true;
        // Check column (skip self)
        if (i !== r && board[i][c] === value) return true;
    }

    // 2. Check 3x3 Box
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const row = startRow + i;
            const col = startCol + j;
            // Skip self
            if (row === r && col === c) continue;

            if (board[row][col] === value) return true;
        }
    }
    return false;
}

export function isCageConflict(cages, board, cageIndex) {
    const cage = cages[cageIndex];
    let currentSum = 0;
    const values = new Set();
    let isFull = true;

    for (const [r, c] of cage.cells) {
        const value = board[r][c];
        if (value === 0) {
            isFull = false;
        } else {
            currentSum += value;
            if (values.has(value)) {
                // Uniqueness conflict within the cage
                return true;
            }
            values.add(value);
        }
    }

    // Sum conflict:
    // 1. If cage is full and sum is wrong.
    // 2. If current sum exceeds target sum (even if not full).
    if (currentSum > cage.sum) {
        return true;
    }
    if (isFull && currentSum !== cage.sum) {
        return true;
    }

    return false;
}

/**
 * Calculate all valid unique combinations of `count` distinct numbers (1-9) that sum to `targetSum`.
 * @param {number} targetSum
 * @param {number} count
 * @returns {number[][]} Array of valid combinations (sorted).
 */
export function getCageCombinations(targetSum, count) {
    const results = [];

    function findCombinations(startVal, currentSum, currentCombo) {
        if (currentCombo.length === count) {
            if (currentSum === targetSum) {
                results.push([...currentCombo]);
            }
            return;
        }

        for (let num = startVal; num <= 9; num++) {
            if (currentSum + num > targetSum) break; // Optimization
            findCombinations(num + 1, currentSum + num, [...currentCombo, num]);
        }
    }

    findCombinations(1, 0, []);
    return results;
}
