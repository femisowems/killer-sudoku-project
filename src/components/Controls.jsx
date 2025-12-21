
import React, { useEffect } from 'react';

const Controls = ({
    difficulty, setDifficulty,
    onNumberInput, onHint, onCheck, onNewGame,
    onClear, onSolve
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

            {/* Difficulty Selector */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <label htmlFor="difficulty-select" className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Difficulty</label>
                <div className="relative">
                    <select
                        id="difficulty-select"
                        value={difficulty}
                        onChange={(e) => onNewGame(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow cursor-pointer hover:bg-slate-100"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

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

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onNewGame(difficulty)}
                    className="col-span-2 py-3 px-4 bg-slate-800 text-white font-semibold rounded-xl shadow hover:bg-slate-900 active:transform active:scale-[0.98] transition-all"
                >
                    New Game
                </button>
                <button
                    onClick={onCheck}
                    className="py-3 px-4 bg-white text-slate-700 border border-slate-200 font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 active:transform active:scale-[0.98] transition-all"
                >
                    Check
                </button>
                <button
                    onClick={onHint}
                    className="py-3 px-4 bg-amber-100 text-amber-700 font-semibold rounded-xl shadow-sm hover:bg-amber-200 active:transform active:scale-[0.98] transition-all"
                >
                    Hint
                </button>
                <button
                    onClick={onSolve}
                    className="col-span-2 py-3 px-4 bg-rose-100 text-rose-700 font-semibold rounded-xl shadow-sm hover:bg-rose-200 active:transform active:scale-[0.98] transition-all"
                >
                    Solve
                </button>
            </div>
        </div>
    );
};

export default Controls;
