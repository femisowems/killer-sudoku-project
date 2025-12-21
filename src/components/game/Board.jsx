
import React from 'react';
import Cell from './Cell';
import { isStandardConflict, isCageConflict } from '../../logic/sudoku-validation';

const Board = ({
    board, cages, cellToCageIndex,
    selectedCell, onSelect, isFixed, highlightedCageIndex, isPaused, onTogglePause
}) => {
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
        <div id="sudoku-board-container" data-component="Board" className="relative bg-white w-full rounded-xl shadow-2xl overflow-hidden animate-pop-in border-4 border-slate-700">
            {isPaused && (
                <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                    <button
                        onClick={onTogglePause}
                        className="group relative bg-white rounded-full p-6 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer mb-4 ring-8 ring-white/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-bold bg-slate-800 px-2 py-1 rounded shadow-lg">
                            Resume Game
                        </div>
                    </button>
                    <div className="bg-white/90 px-6 py-2 rounded-full shadow-lg backdrop-blur text-slate-800 font-bold text-lg mt-9">
                        Game Paused
                    </div>
                </div>
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
                        if (selectedCell) {
                            const { r: sr, c: sc } = selectedCell;
                            if (sr === r || sc === c) isHighlighted = true;
                            if (Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3)) isHighlighted = true;
                        }

                        const conflictStandard = isStandardConflict(board, r, c);
                        const conflictCage = conflictingCageIndices.has(cageIndex);

                        return (
                            <Cell
                                key={`${r} -${c} `}
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

export default Board;
