import { SEED_BOARD, DIFFICULTY_COUNTS, CAGE_SHAPES } from '../constants/sudoku-constants';

export function generatePuzzle(difficulty) {
    const count = DIFFICULTY_COUNTS[difficulty] || 30;

    // 1. Map cells to their cage index for quick lookup
    const cellToCage = new Array(9).fill(0).map(() => new Array(9).fill(-1));
    CAGE_SHAPES.forEach((cage, index) => {
        cage.cells.forEach(([r, c]) => {
            cellToCage[r][c] = index;
        });
    });

    // 2. Prepare cage tracking
    const cageTotalCells = CAGE_SHAPES.map(c => c.cells.length);
    const cageRevealedCount = new Array(CAGE_SHAPES.length).fill(0);

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
        if (cageIdx !== -1) {
            if (cageRevealedCount[cageIdx] + 1 < cageTotalCells[cageIdx]) {
                // Safe to reveal
                selectedCells.push([r, c]);
                cageRevealedCount[cageIdx]++;
            } else {
                // Skip this cell to keep at least one hidden in the cage
                // Note: In very rare cases (small board/high count), we might run out of candidates.
                // But for standard Sudoku (81 cells) and typical counts (30-40), this is fine.
            }
        } else {
            // Fallback for cells not in a cage (shouldn't happen in valid Killer Sudoku)
            selectedCells.push([r, c]);
        }
    }

    return selectedCells;
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

// Check if the board satisfies Killer Sudoku cage uniqueness rules
function isKillerValid(board) {
    for (const cage of CAGE_SHAPES) {
        const values = new Set();
        for (const [r, c] of cage.cells) {
            const val = board[r][c];
            if (values.has(val)) return false;
            values.add(val);
        }
    }
    return true;
}

// Generate a randomised valid board from the seed
export function generateValidBoard() {
    let attempts = 0;
    const MAX_ATTEMPTS = 500;

    while (attempts < MAX_ATTEMPTS) {
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

        // 5. Verify Killer Constraints (Cage Uniqueness)
        if (isKillerValid(board)) {
            return board;
        }

        attempts++;
    }

    console.warn(`Failed to generate a valid Killer Sudoku board in ${MAX_ATTEMPTS} attempts. Returning a potentially invalid board.`);
    return JSON.parse(JSON.stringify(SEED_BOARD)); // Fallback to seed if all else fails (should be rare/impossible if seed is valid)
}
