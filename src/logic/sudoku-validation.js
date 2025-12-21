
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
