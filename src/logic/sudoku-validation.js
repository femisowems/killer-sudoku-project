
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

/**
 * Checks if a specific row is complete (contains 1-9 exactly once and no zeros).
 * @param {number[][]} board
 * @param {number} rowIndex
 * @returns {boolean}
 */
export function isRowComplete(board, rowIndex) {
    const row = board[rowIndex];
    // Fail immediately if there's a zero
    if (row.includes(0)) return false;

    const values = new Set(row);
    // Check if we have exactly 9 unique numbers
    return values.size === 9;
}

/**
 * Checks if a specific column is complete (contains 1-9 exactly once and no zeros).
 * @param {number[][]} board
 * @param {number} colIndex
 * @returns {boolean}
 */
export function isColumnComplete(board, colIndex) {
    const values = new Set();
    for (let r = 0; r < 9; r++) {
        const val = board[r][colIndex];
        if (val === 0) return false;
        values.add(val);
    }
    return values.size === 9;
}

/**
 * Checks if a specific 3x3 box is complete (contains 1-9 exactly once and no zeros).
 * @param {number[][]} board
 * @param {number} startRow - Top-left row index of the box (0, 3, 6)
 * @param {number} startCol - Top-left column index of the box (0, 3, 6)
 * @returns {boolean}
 */
export function isBoxComplete(board, startRow, startCol) {
    const values = new Set();
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const val = board[startRow + r][startCol + c];
            if (val === 0) return false;
            values.add(val);
        }
    }
    return values.size === 9;
}

// --- Helpers for Refactoring ---

export const getRowId = (r) => `row-${r}`;
export const getColId = (c) => `col-${c}`;
export const getBoxId = (r, c) => `box-${Math.floor(r / 3)}-${Math.floor(c / 3)}`;

export function getAffectedGroupIds(r, c) {
    return [
        getRowId(r),
        getColId(c),
        getBoxId(r, c)
    ];
}

/**
 * Checks the relevant row, column, and box for a specific cell position.
 * Returns an array of IDs of groups that are COMPLETE.
 */
export function checkRelatedGroups(board, r, c) {
    const results = [];

    // Row
    if (isRowComplete(board, r)) results.push(getRowId(r));

    // Col
    if (isColumnComplete(board, c)) results.push(getColId(c));

    // Box
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    if (isBoxComplete(board, startRow, startCol)) results.push(getBoxId(r, c));

    return results;
}
