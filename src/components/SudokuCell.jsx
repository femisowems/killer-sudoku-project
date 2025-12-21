
import React from 'react';

const SudokuCell = ({
    r, c, value, cageIndex,
    isSelected, isHighlighted, isCageHighlighted, fixedState,
    isConflict, isCageConflict, cageSum,
    onSelect, cellToCageIndex
}) => {
    // 1. Grid Borders (Outer Container) - Always Solid
    const getGridBorders = () => {
        const thinSolid = '1px solid #cbd5e1'; // slate-300
        const thickSolid = '2px solid #475569'; // slate-600

        const style = {};

        // Left
        if (c === 0 || c % 3 === 0) style.borderLeft = thickSolid;
        else style.borderLeft = thinSolid;

        // Right
        if (c === 8) style.borderRight = thickSolid;

        // Top
        if (r === 0 || r % 3 === 0) style.borderTop = thickSolid;
        else style.borderTop = thinSolid;

        // Bottom
        if (r === 8) style.borderBottom = thickSolid;

        return style;
    };

    // 2. Cage Borders (Inner Overlay) - Dashed & Inset
    const getCageBorders = () => {
        // Use lighter border for dark backgrounds (Selected or Conflict)
        const isDarkBg = isSelected || isConflict;
        const dashedCage = isDarkBg
            ? '2px dashed rgba(255, 255, 255, 0.7)' // White-ish for dark bg
            : '2px dashed #64748b'; // Slate-500 for light bg

        const style = {};

        // Helper to safely get neighbor cage index
        const getCage = (row, col) => {
            if (row < 0 || row > 8 || col < 0 || col > 8) return -1;
            return cellToCageIndex[row][col];
        };

        // Left
        if (getCage(r, c - 1) !== cageIndex) style.borderLeft = dashedCage;
        // Right
        if (getCage(r, c + 1) !== cageIndex) style.borderRight = dashedCage;
        // Top
        if (getCage(r - 1, c) !== cageIndex) style.borderTop = dashedCage;
        // Bottom
        if (getCage(r + 1, c) !== cageIndex) style.borderBottom = dashedCage;

        return style;
    };

    // Standardized Font Size
    let baseClasses = "relative flex justify-center items-center text-2xl md:text-3xl cursor-pointer select-none transition-all duration-200 focus:outline-none";

    // Background Color Logic
    let bgColorClass = 'bg-white'; // Default hover state
    let textClass = 'text-slate-700';
    let zIndexClass = 'z-0'; // Default stacking

    if (isConflict) {
        bgColorClass = 'bg-rose-400 text-white';
        textClass = 'text-white';
        zIndexClass = 'z-10';
    }
    else if (isCageConflict) {
        bgColorClass = 'bg-rose-100';
    }
    else if (isSelected) {
        bgColorClass = 'bg-primary text-white';
        textClass = 'text-white font-semibold';
        zIndexClass = 'z-30';
    }
    else if (isCageHighlighted) {
        bgColorClass = 'bg-yellow-100';
    }
    else if (fixedState === 'hinted') {
        bgColorClass = 'bg-amber-100';
        textClass = 'text-amber-900 font-bold';
    }
    else if (fixedState === 'prefilled') {
        bgColorClass = 'bg-slate-100';
        textClass = 'text-slate-900';
    }
    else if (isHighlighted) {
        bgColorClass = 'bg-indigo-50';
        textClass = 'text-primary';
    }
    else if (value !== 0) {
        // User entered value
        textClass = 'text-primary font-medium';
    }

    // Fix hover blocking selection
    if (!isSelected && !isConflict && !fixedState) {
        bgColorClass += ' hover:bg-slate-50';
    }

    return (
        <div
            onClick={() => onSelect(r, c)}
            className={`${baseClasses} ${bgColorClass} ${textClass} ${zIndexClass}`}
            style={{
                ...getGridBorders(),
                aspectRatio: '1/1'
            }}
        >
            {/* Inner Cage Border Overlay */}
            <div
                className="absolute inset-[3px] pointer-events-none z-20"
                style={getCageBorders()}
            />

            {cageSum && (
                <span className={`absolute top-[4px] left-[4px] text-xs font-bold leading-none pointer-events-none z-30 px-1 py-0.5 rounded-sm ${isSelected || isConflict ? 'text-white bg-slate-800/40' : 'text-slate-800 bg-white/60'}`}>
                    {cageSum}
                </span>
            )}

            {value !== 0 ? value : ''}
        </div>
    );
};

export default SudokuCell;
