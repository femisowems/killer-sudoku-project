
import React, { useEffect } from 'react';

const Controls = ({
    onNumberInput, onClear
}) => {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key >= '1' && e.key <= '9') {
                onNumberInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                onClear();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNumberInput, onClear]);

    return (
        <div id="controls-container" data-component="Controls" className="w-full flex flex-col gap-6 animate-fade-in delay-100">



            {/* Number Input Panel */}
            <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
                <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => onNumberInput(num)}
                            className="aspect-square flex items-center justify-center bg-slate-50 text-slate-700 text-xl font-bold rounded-2xl border border-slate-200 shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:shadow-md active:scale-95 transition-all duration-200"
                        >
                            {num}
                        </button>
                    ))}

                    {/* Clear Button */}
                    <button
                        onClick={onClear}
                        className="aspect-square flex items-center justify-center bg-slate-100 text-slate-500 rounded-2xl border border-slate-200 hover:bg-rose-100 hover:text-rose-500 hover:border-rose-200 active:scale-95 transition-all duration-200"
                        aria-label="Clear"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>


        </div>
    );
};

export default Controls;
