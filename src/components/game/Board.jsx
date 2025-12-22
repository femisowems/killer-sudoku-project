
import React from 'react';
import Cell from './Cell';
import { isStandardConflict, isCageConflict } from '../../logic/sudoku-validation';

import { useGame } from '../../context/GameContext';

const Board = ({ highlightedCageIndex }) => {
    const {
        board, solutionBoard, showErrors, cages, cellToCageIndex,
        selectedCell, handleCellSelect, isFixed, isPaused, togglePause, notes
    } = useGame();

    // Map context function names to local prop names for consistency if needed, 
    // or just direct use.
    const onSelect = handleCellSelect;
    const onTogglePause = togglePause;
    // Helper to find cage object by index
    const getCage = (idx) => cages[idx];

    // Track conflicting cages for efficient lookup
    const conflictingCageIndices = React.useMemo(() => {
        const indices = new Set();
        cages.forEach((_, idx) => {
            if (isCageConflict(cages, board, idx)) indices.add(idx);
        });
        return indices;
    }, [board, cages]);

    return (
        <div id="sudoku-board-container" className="relative bg-white w-full rounded-xl shadow-2xl overflow-hidden animate-pop-in border-4 border-slate-700">
            {isPaused && (
                <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-md transition-all duration-300"></div>
            )}
            <div
                id="sudoku-grid"
                className="grid grid-cols-9 w-full bg-slate-800 gap-[1px] border-[1px] border-slate-800"
            >
                {board.map((row, r) => (
                    row.map((value, c) => {
                        const cageIndex = cellToCageIndex[r][c];
                        const cage = getCage(cageIndex);

                        // Determine if this is the top-left cell of the cage to show sum
                        let showSum = false;
                        if (cage && cage.cells[0][0] === r && cage.cells[0][1] === c) {
                            showSum = true;
                        }

                        const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;

                        // Highlight logic
                        let isHighlighted = false;
                        let isSameValue = false;

                        if (selectedCell) {
                            const { r: sr, c: sc } = selectedCell;
                            const selectedValue = board[sr][sc];

                            // Highlight peers (row, col, box)
                            if (sr === r || sc === c) isHighlighted = true;
                            if (Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3)) isHighlighted = true;

                            // Highlight same numbers (if not empty)
                            if (selectedValue !== 0 && value === selectedValue) {
                                isSameValue = true;
                            }
                        }

                        const conflictStandard = isStandardConflict(board, r, c);
                        const conflictCage = conflictingCageIndices.has(cageIndex);

                        // Real-time error highlight
                        const isError = showErrors && value !== 0 && value !== solutionBoard[r][c];

                        return (
                            <Cell
                                key={`${r} -${c} `}
                                r={r} c={c}
                                value={value}
                                cageIndex={cageIndex}
                                cageSum={showSum ? cage.sum : null}
                                isSelected={isSelected}
                                isHighlighted={isHighlighted}
                                isSameValue={isSameValue}
                                isCageHighlighted={highlightedCageIndex === cageIndex}
                                isError={isError}
                                fixedState={isFixed(r, c)}
                                isConflict={conflictStandard}
                                isCageConflict={conflictCage}
                                onSelect={onSelect}
                                cellToCageIndex={cellToCageIndex}
                                notes={notes[r][c]}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default React.memo(Board);
