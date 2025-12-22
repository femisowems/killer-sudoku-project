
import React, { useEffect } from 'react';

import { useGame } from '../../context/GameContext';

const Controls = () => {
    const { handleNumberInput, board } = useGame();
    // Map for consistency
    const onNumberInput = handleNumberInput;
    const onClear = React.useCallback(() => handleNumberInput(0), [handleNumberInput]);

    // Calculate numberCounts locally or get it from context if we move it there.
    // Ideally this logic should be in the hook/context, but for now we can derive it here 
    // or keep it in App. Wait, if App calculates it, Controls needs it.
    // Let's verify if `board` is in context. Yes.
    // So we can memoize it here.
    const numberCounts = React.useMemo(() => {
        const counts = Array(10).fill(0);
        board.forEach(row => {
            row.forEach(val => {
                if (val >= 1 && val <= 9) counts[val]++;
            });
        });
        return counts;
    }, [board]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key >= '1' && e.key <= '9') {
                const num = parseInt(e.key);
                // Only allow input via keyboard if not fully used
                if (!numberCounts || numberCounts[num] < 9) {
                    onNumberInput(num);
                }
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                onClear();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNumberInput, onClear, numberCounts]);

    return (
        <div id="controls-container" className="w-full flex flex-col gap-6 animate-fade-in delay-100">



            {/* Number Input Panel */}
            <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
                <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                        const isComplete = numberCounts && numberCounts[num] >= 9;
                        return (
                            <button
                                key={num}
                                onClick={() => !isComplete && onNumberInput(num)}
                                disabled={isComplete}
                                className={`aspect-square flex items-center justify-center text-xl font-bold rounded-2xl border shadow-sm transition-all duration-200 ${isComplete
                                    ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-md active:scale-95'
                                    }`}
                            >
                                {num}
                            </button>
                        );
                    })}

                    {/* Clear Button */}
                    <button
                        onClick={onClear}
                        className="aspect-square flex items-center justify-center bg-slate-100 text-slate-500 rounded-2xl border border-slate-200 hover:bg-rose-100 hover:text-rose-500 hover:border-rose-200 active:scale-95 transition-all duration-200"
                        aria-label="Clear"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21L2.7 16.7c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 21H7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11l9 9" />
                        </svg>
                    </button>
                </div>
            </div>


        </div>
    );
};

export default Controls;
