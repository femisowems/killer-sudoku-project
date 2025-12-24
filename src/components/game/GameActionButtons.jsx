import React from 'react';
import { useGame } from '../../context/GameContext';

const GameActionButtons = ({ onNewGame }) => {
    const {
        isWon,
        checkErrors,
        showErrors,
        undo,
        redo,
        canUndo,
        canRedo,
        toggleNotesMode,
        isNotesMode,
        hintsRemaining,
        handleHint,
        togglePause,
        isPaused,
        solveGame
    } = useGame();

    return (
        <React.Fragment>
            <button
                onClick={onNewGame}
                className="py-3 px-2 text-white font-semibold rounded-xl shadow hover:brightness-110 active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--border-thick)' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                New
            </button>
            {/* Check & Undo/Redo Group */}
            <div className="col-span-1 flex gap-1">
                <button
                    onClick={checkErrors}
                    disabled={isWon}
                    className={`flex-1 py-3 px-1 font-semibold rounded-xl shadow-sm active:scale-[0.98] transition-all text-sm flex items-center justify-center border ${isWon
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : showErrors
                            ? 'bg-rose-100 text-rose-700 border-rose-200 ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    title="Check Errors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isWon ? 'text-slate-400' : showErrors ? 'text-rose-500' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </button>
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={undo}
                        disabled={isWon || !canUndo}
                        className={`flex-1 px-2 rounded-lg text-xs font-bold transition-all ${isWon || !canUndo ? 'text-slate-300 bg-slate-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:scale-95'}`}
                        title="Undo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    </button>
                    <button
                        onClick={redo}
                        disabled={isWon || !canRedo}
                        className={`flex-1 px-2 rounded-lg text-xs font-bold transition-all ${isWon || !canRedo ? 'text-slate-300 bg-slate-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:scale-95'}`}
                        title="Redo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
            {/* Notes & Hint Group */}
            <div className={`flex rounded-xl p-1 gap-1 border transition-colors`} style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                <button
                    onClick={toggleNotesMode}
                    disabled={isWon}
                    className={`relative flex-1 flex items-center justify-center rounded-lg active:scale-95 transition-all shadow-sm ${isWon
                        ? 'bg-transparent opacity-50 cursor-not-allowed'
                        : isNotesMode
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'hover:brightness-95'
                        }`}
                    style={{ color: !isWon && !isNotesMode ? 'var(--text-base)' : undefined }}
                    title="Toggle Notes Mode"
                >
                    {/* Badge */}
                    <div className={`absolute -top-2 -left-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full border shadow-sm ${isNotesMode ? 'bg-primary text-white border-white' : 'bg-slate-200 text-slate-500 border-white'}`}>
                        {isNotesMode ? 'ON' : 'OFF'}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button
                    onClick={handleHint}
                    disabled={isWon || hintsRemaining <= 0}
                    className={`relative flex-1 flex items-center justify-center rounded-lg active:scale-95 transition-all shadow-sm ${(isWon || hintsRemaining <= 0)
                        ? 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed'
                        : 'hover:bg-amber-200 text-amber-600'
                        }`}
                    title={isWon ? "Game Won" : hintsRemaining > 0 ? "Get Hint" : "No Hints Remaining"}
                >
                    {/* Badge */}
                    <div className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-sm ${!isWon && hintsRemaining > 0 ? 'bg-amber-500 text-white border-white' : 'bg-slate-200 text-slate-400 border-white'}`}>
                        {hintsRemaining}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                </button>
            </div>

            <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--bg-app)' }}>
                <button
                    onClick={togglePause}
                    disabled={isWon}
                    className={`flex-1 flex items-center justify-center rounded-lg active:scale-95 transition-all shadow-sm ${isWon
                        ? 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed'
                        : isPaused
                            ? 'bg-primary text-white'
                            : 'bg-white text-slate-600 hover:text-primary transition-colors'
                        }`}
                    style={{ backgroundColor: !isWon && !isPaused ? 'var(--bg-panel)' : undefined, color: !isWon && !isPaused ? 'var(--text-base)' : undefined }}
                    title={isPaused ? "Resume Game" : "Pause Game"}
                >
                    {isPaused ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" /></svg>
                    )}
                </button>
                <button
                    onClick={solveGame}
                    disabled={isWon}
                    className={`flex-1 flex items-center justify-center rounded-lg active:scale-95 transition-all shadow-sm ${isWon
                        ? 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed'
                        : 'bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors'
                        }`}
                    style={{ backgroundColor: !isWon ? 'var(--bg-panel)' : undefined }}
                    title="Solve Puzzle"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </React.Fragment>
    );
};

export default GameActionButtons;
