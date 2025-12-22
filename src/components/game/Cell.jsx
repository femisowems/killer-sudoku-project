import React from 'react';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Cell = ({
    r, c, value, cageIndex,
    isSelected, isHighlighted, isSameValue, isCageHighlighted, fixedState,
    isConflict, isCageConflict, cageSum, isError,
    onSelect, cellToCageIndex, notes
}) => {
    // ... existing logic ...

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
        const isDarkBg = isSelected || isConflict || isError;
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
    const baseClasses = "relative flex justify-center items-center text-lg sm:text-2xl md:text-3xl cursor-pointer select-none transition-all duration-200 focus:outline-none";

    // Background Color Logic
    let bgColorClass = 'bg-white'; // Default hover state
    let textClass = 'text-slate-700';
    let zIndexClass = 'z-0'; // Default stacking

    if (isError) {
        bgColorClass = 'bg-rose-300';
        textClass = 'text-rose-900 font-bold';
        zIndexClass = 'z-20';
    }
    else if (isConflict) {
        bgColorClass = 'bg-rose-400 text-white';
        textClass = 'text-white font-bold';
        zIndexClass = 'z-10';
    }
    else if (isCageConflict) {
        bgColorClass = 'bg-rose-100';
    }
    else if (isSelected) {
        bgColorClass = 'bg-primary text-white';
        textClass = 'text-white font-bold';
        zIndexClass = 'z-30';
    }
    else if (isSameValue) {
        bgColorClass = 'bg-indigo-200';
        textClass = 'text-primary font-bold';
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
        textClass = 'text-slate-900 font-bold';
    }
    else if (isHighlighted) {
        bgColorClass = 'bg-indigo-50';
        textClass = 'text-primary font-bold';
    }
    else if (value !== 0) {
        // User entered value
        textClass = 'text-primary font-bold';
    }

    // Fix hover blocking selection
    if (!isSelected && !isConflict && !fixedState && !isSameValue) {
        bgColorClass += ' hover:bg-slate-50';
    }

    return (
        <div
            onClick={() => onSelect(r, c)}
            className={`${baseClasses} ${bgColorClass} ${textClass} ${zIndexClass}`}
            style={{
                ...getGridBorders(),
                aspectRatio: '0.9'
            }}
        >
            {/* Inner Cage Border Overlay */}
            <div
                className="absolute inset-[3px] pointer-events-none z-20"
                style={getCageBorders()}
            />

            {cageSum && (
                <span className={`absolute top-[6px] left-[5px] md:top-[6px] md:left-[6px] text-[8px] md:text-xs font-bold leading-none pointer-events-none z-30 px-[2px] py-0 md:px-1 md:py-0.5 rounded-sm ${isSelected || isConflict ? 'text-white' : 'text-slate-800'}`}>
                    {cageSum}
                </span>
            )}

            {value !== 0 ? (
                <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={value}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {value}
                </motion.span>
            ) : (
                <div className={`grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 sm:p-1 pt-4 sm:pt-5 md:pt-6 pb-0.5`}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <div key={num} className={`flex items-center justify-center text-[7px] sm:text-[8px] md:text-[9px] leading-none font-medium ${isSelected || isConflict ? 'text-white/90' : 'text-slate-500'}`}>
                            {notes && notes.has(num) ? num : ''}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(Cell);
