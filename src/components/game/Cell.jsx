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
        const thinSolid = '1px solid var(--border-thin)';
        const thickSolid = '2px solid var(--border-thick)';

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
            : '2px dashed var(--text-muted)'; // Thematic muted color

        const style = {};
        // ... rest of getCageBorders remains same ...
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
    let bgColorClass = ''; // Will use inline style for theme-aware bg
    let textClass = '';
    let zIndexClass = 'z-0'; // Default stacking

    const themeStyles = {
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-base)'
    };

    if (isError) {
        themeStyles.backgroundColor = 'var(--bg-error)';
        themeStyles.color = 'var(--text-error)';
        themeStyles.fontWeight = 'bold';
        zIndexClass = 'z-20';
    }
    else if (isConflict) {
        themeStyles.backgroundColor = 'var(--bg-error)';
        themeStyles.color = 'var(--text-error)';
        themeStyles.fontWeight = 'bold';
        zIndexClass = 'z-10';
    }
    else if (isCageConflict) {
        themeStyles.backgroundColor = 'rgba(244, 63, 94, 0.1)'; // Subtle red without wiping theme
    }
    else if (isSelected) {
        themeStyles.backgroundColor = 'var(--bg-selected)';
        themeStyles.color = 'var(--text-selected)';
        themeStyles.fontWeight = 'bold';
        zIndexClass = 'z-30';
    }
    else if (isSameValue) {
        themeStyles.backgroundColor = 'var(--bg-highlight)';
        themeStyles.color = 'var(--primary-accent)';
        themeStyles.fontWeight = 'bold';
    }
    else if (isCageHighlighted) {
        // Keep a thematic hint for cage highlighting
        themeStyles.backgroundColor = 'var(--primary-accent-muted)';
    }
    else if (fixedState === 'hinted') {
        themeStyles.backgroundColor = 'var(--bg-hint)';
        themeStyles.color = 'var(--text-hint)';
        themeStyles.fontWeight = 'bold';
    }
    else if (fixedState === 'prefilled') {
        themeStyles.backgroundColor = 'var(--bg-prefilled)';
        themeStyles.color = 'var(--text-prefilled)';
        themeStyles.fontWeight = 'bold';
    }
    else if (isHighlighted) {
        themeStyles.backgroundColor = 'var(--bg-highlight)';
        themeStyles.color = 'var(--primary-accent)';
        themeStyles.fontWeight = 'bold';
    }
    else if (value !== 0) {
        // User entered value
        themeStyles.color = 'var(--primary-accent)';
        themeStyles.fontWeight = 'bold';
    }

    // Fix hover blocking selection
    if (!isSelected && !isConflict && !fixedState && !isSameValue) {
        bgColorClass += ' hover:brightness-95'; // Subtle hover across themes
    }

    return (
        <div
            onClick={() => onSelect(r, c)}
            className={`${baseClasses} ${bgColorClass} ${textClass} ${zIndexClass}`}
            style={{
                ...getGridBorders(),
                ...themeStyles,
                aspectRatio: '0.9'
            }}
        >
            {/* Inner Cage Border Overlay */}
            <div
                className="absolute inset-[3px] pointer-events-none z-20"
                style={getCageBorders()}
            />

            {cageSum && (
                <span className={`absolute top-[6px] left-[5px] md:top-[6px] md:left-[6px] text-[8px] md:text-xs font-bold leading-none pointer-events-none z-30 px-[2px] py-0 md:px-1 md:py-0.5 rounded-sm ${isSelected || isConflict ? 'text-white' : ''}`} style={{ color: !(isSelected || isConflict) ? 'var(--text-base)' : undefined }}>
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
                        <div key={num} className={`flex items-center justify-center text-[7px] sm:text-[8px] md:text-[9px] leading-none font-medium ${isSelected || isConflict ? 'text-white/90' : ''}`} style={{ color: !(isSelected || isConflict) ? 'var(--text-muted)' : undefined }}>
                            {notes && notes.has(num) ? num : ''}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(Cell);
