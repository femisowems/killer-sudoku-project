
import React, { useEffect } from 'react';

const Controls = ({
    onNumberInput, onClear, numberCounts
}) => {

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
        <div id="controls-container" data-component="Controls" className="w-full flex flex-col gap-6 animate-fade-in delay-100">



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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>


        </div>
    );
};

export default Controls;
