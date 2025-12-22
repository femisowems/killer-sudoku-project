
import React from 'react';

import { useGame } from '../../context/GameContext';

const DifficultyModal = ({ isOpen, onClose }) => {
    const { startNewGame, isWon, timerSeconds, mistakes, setIsPaused, difficulty } = useGame();

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Check if game is in progress (not won, and has specific progress)
    // User request: "game has been played for longer than 10 seconds"
    // We strictly enforce timerSeconds > 10.
    const hasActiveGame = !isWon && timerSeconds > 10;

    // Helper to handle selection
    const onSelectDifficulty = (diff) => {
        startNewGame(diff);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={hasActiveGame ? onClose : undefined}></div>

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-pop-in border-4 border-slate-100 overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">New Game</h2>
                    <p className="text-slate-500 mb-6">Select a difficulty level to start.</p>

                    <div className="space-y-3">
                        {hasActiveGame && (
                            <button
                                onClick={() => {
                                    setIsPaused(false);
                                    onClose();
                                }}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md border-2 border-slate-700 flex flex-col items-center justify-center gap-1"
                            >
                                <span className="text-lg font-bold">Continue Game</span>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 uppercase tracking-wider bg-slate-700/50 px-3 py-0.5 rounded-full">
                                    <span>{difficulty}</span>
                                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                    <span>{formatTime(timerSeconds)}</span>
                                </div>
                            </button>
                        )}
                        <div className="border-t border-slate-100 my-4 pt-4" hidden={!hasActiveGame}></div>

                        <button
                            onClick={() => onSelectDifficulty('easy')}
                            className="w-full py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Easy
                        </button>
                        <button
                            onClick={() => onSelectDifficulty('medium')}
                            className="w-full py-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Medium
                        </button>
                        <button
                            onClick={() => onSelectDifficulty('hard')}
                            className="w-full py-4 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Hard
                        </button>
                    </div>

                    {!hasActiveGame && (
                        <button
                            onClick={onClose}
                            className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
};

export default DifficultyModal;
