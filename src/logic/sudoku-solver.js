
import { isStandardConflict } from './sudoku-validation';

/**
 * Solves a Sudoku board using backtracking.
 * @param {number[][]} board - The 9x9 board to solve (0 for empty cells).
 * @returns {number[][] | null} - The solved board or null if no solution.
 */
export function solveSudoku(board) {
    const solution = board.map(row => [...row]);
    if (solve(solution)) {
        return solution;
    }
    return null;
}

/**
 * Counts the number of solutions for a given board.
 * @param {number[][]} board 
 * @param {number} limit - Stop counting after this many solutions (optimization).
 * @returns {number} - Number of solutions found (up to limit).
 */
export function countSolutions(board, limit = 2) {
    const solution = board.map(row => [...row]);
    let count = 0;

    function solveAndCount(currentBoard) {
        if (count >= limit) return;

        const emptyCell = findEmptyCell(currentBoard);
        if (!emptyCell) {
            count++;
            return;
        }

        const [r, c] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            currentBoard[r][c] = num;
            if (!isStandardConflict(currentBoard, r, c)) {
                solveAndCount(currentBoard);
                if (count >= limit) return;
            }
            currentBoard[r][c] = 0; // Backtrack
        }
    }

    solveAndCount(solution);
    return count;
}

function solve(board) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true; // Solved

    const [r, c] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        board[r][c] = num;
        if (!isStandardConflict(board, r, c)) {
            if (solve(board)) return true;
        }
        board[r][c] = 0; // Backtrack
    }

    return false;
}

function findEmptyCell(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) return [r, c];
        }
    }
    return null;
}
