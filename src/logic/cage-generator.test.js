
import { describe, it, expect } from 'vitest';
import { generateCages } from './cage-generator';

describe('Cage Generator', () => {

    // Helper to flatten cages into a grid of coverage
    const getCoverage = (cages) => {
        const grid = Array(9).fill(0).map(() => Array(9).fill(false));
        cages.forEach(cage => {
            cage.cells.forEach(([r, c]) => {
                grid[r][c] = true;
            });
        });
        return grid;
    };

    it('should generate cages that cover all 81 cells', () => {
        const cages = generateCages('medium');
        const coverage = getCoverage(cages);

        // Count total covered cells
        const totalCovered = coverage.flat().filter(x => x).length;
        expect(totalCovered).toBe(81);
    });

    it('should not typically have single-cell cages (though rare exceptions possible if trapped)', () => {
        // Run multiple times to check stochastic behavior
        for (let i = 0; i < 5; i++) {
            const cages = generateCages('medium');
            const singleCells = cages.filter(c => c.cells.length === 1);
            // We configured it to try aggressively to merge single cells
            expect(singleCells.length).toBeLessThan(5);
        }
    });

    it('should respect max size for easy difficulty', () => {
        const cages = generateCages('easy');
        const largeCages = cages.filter(c => c.cells.length > 4); // Easy max is ~3, maybe 4 via merge
        expect(largeCages.length).toBe(0);
    });

    it('should allow larger cages for hard difficulty', () => {
        // Run a few times as it's random
        let foundLarge = false;
        for (let i = 0; i < 10; i++) {
            const cages = generateCages('hard');
            if (cages.some(c => c.cells.length >= 5)) {
                foundLarge = true;
                break;
            }
        }
        expect(foundLarge).toBe(true);
    });

    it('should generate very large cages for expert difficulty', () => {
        let foundMassive = false;
        for (let i = 0; i < 10; i++) {
            const cages = generateCages('expert');
            // Expert allows up to 8 cells
            if (cages.some(c => c.cells.length >= 7)) {
                foundMassive = true;
                break;
            }
        }
        expect(foundMassive).toBe(true);
    });

    it('should limit cage sums for easy difficulty', () => {
        // We need a solution board to test sums
        const solution = [
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

        for (let i = 0; i < 5; i++) {
            const cages = generateCages('easy', solution);
            for (const cage of cages) {
                const sum = cage.cells.reduce((acc, [r, c]) => acc + solution[r][c], 0);
                expect(sum).toBeLessThanOrEqual(15);
            }
        }
    });

    it('should produce valid contiguous cages', () => {
        const cages = generateCages('medium');

        cages.forEach(cage => {
            if (cage.cells.length <= 1) return;

            // Check connectivity using BFS/DFS
            const cells = new Set(cage.cells.map(c => c.join(',')));
            const start = cage.cells[0];
            const visited = new Set();
            const queue = [start];
            visited.add(start.join(','));

            while (queue.length > 0) {
                const [r, c] = queue.shift();

                // neighbors
                [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
                    const nr = r + dr;
                    const nc = c + dc;
                    const key = `${nr},${nc}`;
                    if (cells.has(key) && !visited.has(key)) {
                        visited.add(key);
                        queue.push([nr, nc]);
                    }
                });
            }

            expect(visited.size).toBe(cage.cells.length);
        });
    });
    it('should not have duplicate numbers in a cage', () => {
        // Create a mock solution board (just a valid Sudoku subset or random numbers, 
        // as long as neighbors have duplicates we can test the logic).
        // Let's create a board where every row is 1-9, which is invalid Sudoku but fine for testing generator logic constraints
        // Actually, let's make it a valid Sudoku-like distribution to be fair.
        const mockBoard = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]
        ];

        // Run multiple times
        for (let i = 0; i < 5; i++) {
            const cages = generateCages('medium', mockBoard);
            cages.forEach(cage => {
                const values = cage.cells.map(([r, c]) => mockBoard[r][c]);
                const uniqueValues = new Set(values);
                expect(uniqueValues.size).toBe(values.length);
            });
        }
    });
});
