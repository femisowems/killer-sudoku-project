
import { describe, it, expect } from 'vitest';
import { isRowComplete, isColumnComplete, isBoxComplete } from './sudoku-validation';

describe('Sudoku Validation Logic', () => {
    // Helper to create an empty 9x9 board
    const createEmptyBoard = () => Array(9).fill(0).map(() => Array(9).fill(0));

    describe('isRowComplete', () => {
        it('should return true for a valid complete row', () => {
            const board = createEmptyBoard();
            board[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            expect(isRowComplete(board, 0)).toBe(true);
        });

        it('should return false if row holds zeros', () => {
            const board = createEmptyBoard();
            board[0] = [1, 2, 3, 4, 5, 0, 7, 8, 9];
            expect(isRowComplete(board, 0)).toBe(false);
        });

        it('should return false if row has duplicates (even if full)', () => {
            const board = createEmptyBoard();
            // Double 5, missing 6
            board[0] = [1, 2, 3, 4, 5, 5, 7, 8, 9];
            expect(isRowComplete(board, 0)).toBe(false);
        });

        it('should be independent of other rows', () => {
            const board = createEmptyBoard();
            board[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Row 0 is valid
            board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Row 1 is empty
            expect(isRowComplete(board, 0)).toBe(true);
            expect(isRowComplete(board, 1)).toBe(false);
        });
    });

    describe('isColumnComplete', () => {
        it('should return true for a valid complete column', () => {
            const board = createEmptyBoard();
            const colIndex = 2;
            for (let r = 0; r < 9; r++) board[r][colIndex] = r + 1;

            expect(isColumnComplete(board, colIndex)).toBe(true);
        });

        it('should return false if column has zeros', () => {
            const board = createEmptyBoard();
            const colIndex = 2;
            for (let r = 0; r < 9; r++) board[r][colIndex] = r + 1;
            board[4][colIndex] = 0; // Create a hole

            expect(isColumnComplete(board, colIndex)).toBe(false);
        });

        it('should return false if column has duplicates', () => {
            const board = createEmptyBoard();
            const colIndex = 2;
            for (let r = 0; r < 9; r++) board[r][colIndex] = r + 1;
            board[8][colIndex] = 1; // Duplicate 1 at bottom, replacing 9

            expect(isColumnComplete(board, colIndex)).toBe(false);
        });
    });

    describe('isBoxComplete', () => {
        it('should return true for a valid complete 3x3 box', () => {
            const board = createEmptyBoard();
            // Fill top-left box
            let val = 1;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board[r][c] = val++;
                }
            }
            expect(isBoxComplete(board, 0, 0)).toBe(true);
        });

        it('should return false if box implies zeros', () => {
            const board = createEmptyBoard();
            let val = 1;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board[r][c] = val++;
                }
            }
            board[1][1] = 0; // Hole in center of box
            expect(isBoxComplete(board, 0, 0)).toBe(false);
        });

        it('should return false if box has duplicates', () => {
            const board = createEmptyBoard();
            let val = 1;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board[r][c] = val++;
                }
            }
            board[2][2] = 1; // Uniqueness violation
            expect(isBoxComplete(board, 0, 0)).toBe(false);
        });

        it('should only check the specified box', () => {
            const board = createEmptyBoard();
            // Fill top-left box correctly
            let val = 1;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board[r][c] = val++;
                }
            }
            // Make another box invalid
            board[3][3] = 0;

            expect(isBoxComplete(board, 0, 0)).toBe(true);
            expect(isBoxComplete(board, 3, 3)).toBe(false);
        });
    });
});
