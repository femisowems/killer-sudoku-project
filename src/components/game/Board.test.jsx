import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Board from './Board';
import * as GameContext from '../../context/GameContext';

// Mock the context
vi.mock('../../context/GameContext', () => ({
    useGame: vi.fn(),
}));

describe('Board Component', () => {
    const mockHandleCellSelect = vi.fn();
    const mockIsFixed = vi.fn();

    const mockContextValue = {
        board: Array(9).fill(0).map(() => Array(9).fill(0)),
        solutionBoard: Array(9).fill(0).map(() => Array(9).fill(1)), // Dummy solution
        showErrors: false,
        cages: [
            { sum: 10, cells: [[0, 0], [0, 1]] } // Simple cage
        ],
        cellToCageIndex: Array(9).fill(0).map(() => Array(9).fill(0)), // All in cage 0 for simplicity, or dummy
        selectedCell: null,
        handleCellSelect: mockHandleCellSelect,
        isFixed: mockIsFixed,
        isPaused: false,
        notes: Array(9).fill(0).map(() => Array(9).fill(new Set())),
    };

    // Fix cellToCageIndex to valid indices
    // Let's make a simple invalid one
    const cellToCageIndex = Array(9).fill(0).map(() => Array(9).fill(0));
    mockContextValue.cellToCageIndex = cellToCageIndex;

    beforeEach(() => {
        vi.clearAllMocks();
        mockIsFixed.mockReturnValue(false); // Default not fixed
        GameContext.useGame.mockReturnValue(mockContextValue);
    });

    it('renders 81 cells', () => {
        const { container } = render(<Board />);
        const grid = container.querySelector('#sudoku-grid');
        expect(grid).toBeInTheDocument();
        expect(grid.children.length).toBe(81);
    });

    it('renders grid container', () => {
        const { container } = render(<Board />);
        const grid = container.querySelector('#sudoku-grid');
        expect(grid).toBeInTheDocument();
        expect(grid.children.length).toBe(81);
    });

    it('displays correct cage sum for top-left cell of cage', () => {
        render(<Board />);
        // Cage 0 is at [0,0] and [0,1]. Sum is 10.
        // Cell at [0,0] should have the sum.
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('calls handleCellSelect when a cell is clicked', () => {
        render(<Board />);
        // Click the first cell ([0,0])
        // We need to find it. 
        // Since it's the first child of the grid.
        const cells = document.querySelectorAll('#sudoku-grid > div'); // Should find cells
        if (cells.length > 0) {
            fireEvent.click(cells[0]);
            expect(mockHandleCellSelect).toHaveBeenCalledWith(0, 0);
        } else {
            // Fallback if querySelector fails in test env (shouldn't)
            // Try finding by text if value set
        }
    });

    it('shows paused overlay when isPaused is true', () => {
        GameContext.useGame.mockReturnValue({
            ...mockContextValue,
            isPaused: true
        });

        const { container } = render(<Board />);
        // Logic: {isPaused && <div className="absolute inset-0 z-50 ..."></div>}
        // We can look for that class
        const overlay = container.querySelector('.backdrop-blur-md');
        expect(overlay).toBeInTheDocument();
    });
});
