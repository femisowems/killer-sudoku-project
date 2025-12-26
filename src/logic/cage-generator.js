/**
 * Procedural Generator for Killer Sudoku Cages
 */

/**
 * Generates a set of cages for a 9x9 grid based on difficulty.
 * 
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @param {number[][]} [solutionBoard] - Optional solution board to ensure uniqueness within cages.
 * @returns {Array<{cells: number[][]}>} List of cages, where each cage has a list of [r, c] coordinates.
 */
export function generateCages(difficulty = 'medium', solutionBoard) {
    // Configuration based on difficulty
    let maxCageSize = 5;
    let preferredSize = 3;
    let complexityChance = 0.3; // Chance to make non-linear shapes
    let maxCageSum = 25; // Limit arithmetic difficulty for Medium

    if (difficulty === 'easy') {
        maxCageSize = 3;
        preferredSize = 2;
        complexityChance = 0.1;
        maxCageSum = 15; // Simple math for Easy
    } else if (difficulty === 'hard') {
        maxCageSize = 6; // Occasional large cages
        preferredSize = 4;
        complexityChance = 0.6;
        maxCageSum = 18; // Full range
    } else if (difficulty === 'expert') {
        maxCageSize = 8; // Very large cages
        preferredSize = 5;
        complexityChance = 0.9; // Almost always complex shapes
        maxCageSum = 20; // Full range
    }

    const grid = Array(9).fill(0).map(() => Array(9).fill(false)); // true if assigned
    const cages = [];

    // Helper: partial check if cell is valid
    const isValid = (r, c) => r >= 0 && r < 9 && c >= 0 && c < 9 && !grid[r][c];

    // Helper: get unassigned neighbors
    const getNeighbors = (r, c) => {
        const deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        return deltas
            .map(([dr, dc]) => [r + dr, c + dc])
            .filter(([nr, nc]) => isValid(nr, nc));
    };

    // Iterate through all cells to ensure coverage
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c]) continue;

            const cageCells = [[r, c]];
            // Track values to prevent duplicates (if solutionBoard provided)
            const cageValues = new Set();
            let currentSum = 0;
            if (solutionBoard) {
                const val = solutionBoard[r][c];
                cageValues.add(val);
                currentSum += val;
            }

            grid[r][c] = true;

            // Determine target size for this cage
            // Weighted random towards preferred size
            let targetSize = Math.floor(Math.random() * (maxCageSize - 1)) + 2;
            // Bias towards preferred
            if (Math.random() > 0.5) targetSize = preferredSize;

            // Hard cap
            if (targetSize > maxCageSize) targetSize = maxCageSize;

            // Grow the cage
            let currentCell = [r, c];

            while (cageCells.length < targetSize) {
                let neighbors = getNeighbors(currentCell[0], currentCell[1]);

                // Filter neighbors that would cause value duplication or exceed max sum
                if (solutionBoard) {
                    neighbors = neighbors.filter(([nr, nc]) => {
                        const val = solutionBoard[nr][nc];
                        if (cageValues.has(val)) return false;
                        if (currentSum + val > maxCageSum) return false;
                        return true;
                    });
                }

                // If no neighbors, try to branch from any existing cell in the cage (complexity)
                if (neighbors.length === 0 || (difficulty === 'hard' && Math.random() < complexityChance)) {
                    // Pick a random cell from the current cage to grow from
                    // We need to try multiple potentially to find one with valid neighbors
                    const shuffledCells = [...cageCells].sort(() => Math.random() - 0.5);

                    for (const randomCell of shuffledCells) {
                        let potentialNeighbors = getNeighbors(randomCell[0], randomCell[1]);
                        if (solutionBoard) {
                            potentialNeighbors = potentialNeighbors.filter(([nr, nc]) => {
                                const val = solutionBoard[nr][nc];
                                if (cageValues.has(val)) return false;
                                if (currentSum + val > maxCageSum) return false;
                                return true;
                            });
                        }

                        if (potentialNeighbors.length > 0) {
                            neighbors = potentialNeighbors;
                            currentCell = randomCell; // Switch growth point
                            break;
                        }
                    }
                }

                if (neighbors.length === 0) break; // Trapped, close the cage

                // Pick a random neighbor
                const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
                cageCells.push(nextCell);
                grid[nextCell[0]][nextCell[1]] = true;

                if (solutionBoard) {
                    const val = solutionBoard[nextCell[0]][nextCell[1]];
                    cageValues.add(val);
                    currentSum += val;
                }

                currentCell = nextCell;
            }

            cages.push({ cells: cageCells });
        }
    }

    // Post-processing: Merge very small cages (size 1) into neighbors
    // Single-cell cages are valid in Killer Sudoku but rare/easy.
    // We try to merge them if possible, BUT ONLY IF UNIQUENESS HOLDS.
    for (let i = cages.length - 1; i >= 0; i--) {
        if (cages[i].cells.length === 1) {
            const [r, c] = cages[i].cells[0];
            const val = solutionBoard ? solutionBoard[r][c] : -1;

            // Find a neighbor cage to merge into
            const deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];

            for (const [dr, dc] of deltas) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
                    // Find the cage containing this neighbor
                    const neighborCage = cages.find(g => g !== cages[i] && g.cells.some(([cr, cc]) => cr === nr && cc === nc));

                    if (neighborCage && neighborCage.cells.length < 8) {
                        // UNIQUNESS CHECK
                        if (solutionBoard) {
                            // Check if neighbor cage already has 'val'
                            const neighborValues = new Set(neighborCage.cells.map(([cr, cc]) => solutionBoard[cr][cc]));
                            if (neighborValues.has(val)) {
                                continue; // Skip this neighbor, duplicate would occur
                            }

                            // SUM CHECK: Ensure merging doesn't exceed maxCageSum
                            const neighborSum = neighborCage.cells.reduce((acc, [cr, cc]) => acc + solutionBoard[cr][cc], 0);
                            if (neighborSum + val > maxCageSum) {
                                continue; // Skip, would exceed sum limit
                            }
                        }

                        neighborCage.cells.push([r, c]);
                        cages.splice(i, 1); // Remove the single-cell cage
                        break;
                    }
                }
            }
        }
    }

    return cages;
}
