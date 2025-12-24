import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { GameProvider } from './context/GameProvider';
import * as generator from './logic/sudoku-generator';

// Mock dependencies
vi.mock('./logic/sudoku-generator');
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// Mock Worker hook to avoid jsdom issues
vi.mock('./hooks/useWorker', () => ({
    useWorker: () => ({
        workerRef: { current: null },
        validateBoard: vi.fn()
    })
}));

// Mock scrollIntoView which is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Game Integration Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('starts a game, plays a winning move, and shows the win modal', async () => {
        // 1. Solution Board
        const solutionBoard = Array(9).fill().map((_, r) =>
            Array(9).fill().map((_, c) => (r * 9 + c) % 9 + 1)
        );

        // 2. Starting Cells (All except 0,0)
        const startingCells = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (r === 0 && c === 0) continue;
                startingCells.push([r, c]);
            }
        }

        // Determine solution value for (0,0)
        const winningNumber = solutionBoard[0][0];

        // Mock generator functions
        generator.generateValidBoard.mockReturnValue(solutionBoard);
        generator.generatePuzzle.mockReturnValue(startingCells);

        render(
            <GameProvider>
                <App />
            </GameProvider>
        );

        // 1. Verify Game Loading/Started
        // "Killer Sudoku" title should be present
        expect(screen.getByText(/Killer Sudoku/i)).toBeInTheDocument();

        // 2. Find the empty cell. 
        // In Board.jsx, cells with value 0 usually render notes or empty.
        // We can find by test id maybe? Or just click the first cell (since we know it's at 0,0).
        // The cells often have `key={`${r}-${c}`}` but not easily queryable attributes.
        // However, standard cells text content is the value. The empty one renders notes.
        // Let's find by role? "button" or generic div?
        // Cell.jsx: outer div has onClick. Content depends on value.
        // If 0, it renders a note grid.

        // Let's query all cell-like elements.
        // Or inspect the DOM structure closer.
        // The board is a grid. Cell (0,0) is the first child.
        // We can try to get the board container.
        const boardGrid = document.querySelector('#sudoku-grid');
        expect(boardGrid).toBeInTheDocument();
        const firstCell = boardGrid.children[0]; // (0,0)

        // 3. Select the cell
        fireEvent.click(firstCell);

        // 4. Input the winning number
        // Find the number button in the controls.
        // They usually have text content "1", "2", etc.
        const numButton = screen.getByText(winningNumber.toString(), { selector: 'button' });
        fireEvent.click(numButton);

        // 5. Check for Win Modal
        // "Solved!" or "Play Another Game"
        await waitFor(() => {
            expect(screen.getByText(/Solved!/i)).toBeInTheDocument();
        });

        // 6. Verify confetti was called
        const confetti = await import('canvas-confetti');
        await waitFor(() => {
            expect(confetti.default).toHaveBeenCalled();
        });
    });
});
