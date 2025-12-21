
import React from 'react';
import SudokuCell from './SudokuCell';
import { isStandardConflict, isCageConflict } from '../utils/sudokuLogic';

const SudokuBoard = ({
    board, cages, cellToCageIndex,
    selectedCell, onSelect, isFixed, highlightedCageIndex
}) => {
    // Helper to find cage object by index
    const getCage = (idx) => cages[idx];

    // Track conflicting cages for efficient lookup
    const conflictingCageIndices = new Set();
    cages.forEach((_, idx) => {
        if (isCageConflict(cages, board, idx)) conflictingCageIndices.add(idx);
    });

    return (
        <div id="sudoku-board-container" data-component="SudokuBoard" className="relative bg-white w-full rounded-xl shadow-2xl overflow-hidden animate-pop-in border-4 border-slate-700">
            <div
                id="sudoku-grid"
                className="grid grid-cols-9 w-full bg-slate-50"
                style={{
                    border: '0',
                    // removed content-box, let border-box handle it
                }}
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
                        if (selectedCell) {
                            const { r: sr, c: sc } = selectedCell;
                            if (sr === r || sc === c) isHighlighted = true;
                            if (Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3)) isHighlighted = true;
                        }

                        const conflictStandard = isStandardConflict(board, r, c);
                        const conflictCage = conflictingCageIndices.has(cageIndex);

                        return (
                            <SudokuCell
                                key={`${r}-${c}`}
                                r={r} c={c}
                                value={value}
                                cageIndex={cageIndex}
                                cageSum={showSum ? cage.sum : null}
                                isSelected={isSelected}
                                isHighlighted={isHighlighted}
                                isCageHighlighted={highlightedCageIndex === cageIndex}
                                fixedState={isFixed(r, c)}
                                isConflict={conflictStandard}
                                isCageConflict={conflictCage}
                                onSelect={onSelect}
                                cellToCageIndex={cellToCageIndex}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default SudokuBoard;
