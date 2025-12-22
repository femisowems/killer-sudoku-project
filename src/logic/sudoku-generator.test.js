import { describe, it, expect } from 'vitest';
import { generateValidBoard, generatePuzzle } from './sudoku-generator';
import { CAGE_SHAPES, DIFFICULTY_COUNTS } from '../constants/sudoku-constants';

describe('Sudoku Generator Logic', () => {

    // Helper to check if a board is a valid standard Sudoku solution
    const isStandardSudokuValid = (board) => {
        // Check rows
        for (let r = 0; r < 9; r++) {
            const set = new Set(board[r]);
            if (set.size !== 9 || [...set].some(n => n < 1 || n > 9)) return false;
        }
        // Check cols
        for (let c = 0; c < 9; c++) {
            const set = new Set();
            for (let r = 0; r < 9; r++) set.add(board[r][c]);
            if (set.size !== 9 || [...set].some(n => n < 1 || n > 9)) return false;
        }
        // Check 3x3 boxes
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                const set = new Set();
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        set.add(board[i + r][j + c]);
                    }
                }
                if (set.size !== 9) return false;
            }
        }
        return true;
    };

    // Helper to check Killer Sudoku cage constraints (unique numbers in cages)
    const isKillerValid = (board) => {
        for (const cage of CAGE_SHAPES) {
            const values = new Set();
            for (const [r, c] of cage.cells) {
                const val = board[r][c];
                if (values.has(val)) return false;
                values.add(val);
            }
        }
        return true;
    };

    describe('generateValidBoard', () => {
        it('should return a 9x9 board', () => {
            const board = generateValidBoard();
            expect(board.length).toBe(9);
            expect(board[0].length).toBe(9);
        });

        it('should generate a board that satisfies standard Sudoku rules', () => {
            const board = generateValidBoard();
            expect(isStandardSudokuValid(board)).toBe(true);
        });

        it('should generate a board that satisfies Killer Sudoku cage uniqueness', () => {
            const board = generateValidBoard();
            expect(isKillerValid(board)).toBe(true);
        });
    });

    describe('generatePuzzle', () => {
        it('should return an array of starting coordinates', () => {
            const puzzle = generatePuzzle('easy');
            expect(Array.isArray(puzzle)).toBe(true);
            puzzle.forEach(coord => {
                expect(coord.length).toBe(2);
                expect(coord[0]).toBeGreaterThanOrEqual(0);
                expect(coord[0]).toBeLessThan(9);
                expect(coord[1]).toBeGreaterThanOrEqual(0);
                expect(coord[1]).toBeLessThan(9);
            });
        });

        it('should match the requested difficulty count (approximate)', () => {
            const easeCount = DIFFICULTY_COUNTS['easy']; // e.g. 40
            const puzzle = generatePuzzle('easy');
            // Logic caps at count, but might stop earlier to preserve hidden cage cells
            // So puzzle size should be <= count
            expect(puzzle.length).toBeLessThanOrEqual(easeCount);
            // It shouldn't be too small though (sanity check)
            expect(puzzle.length).toBeGreaterThan(easeCount - 10);
        });

        it('should never fully reveal a cage (leave at least one cell hidden)', () => {
            // Test with a higher count to force potential full reveals
            const puzzle = generatePuzzle('hard');

            // Map revealing state
            const revealedSet = new Set(puzzle.map(([r, c]) => `${r},${c}`));

            // Generate full set of revealed cells from puzzle output
            // Check each cage
            for (const cage of CAGE_SHAPES) {
                let revealedCount = 0;
                for (const [r, c] of cage.cells) {
                    if (revealedSet.has(`${r},${c}`)) {
                        revealedCount++;
                    }
                }
                // Expect at least one hidden (total - revealed >= 1)
                // EXCEPT: If the code logic changes, but currently `generatePuzzle` enforces this.
                expect(cage.cells.length - revealedCount).toBeGreaterThanOrEqual(1);
            }
        });
    });
});
