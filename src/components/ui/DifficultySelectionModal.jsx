
import React from 'react';

import { useGame } from '../../context/GameContext';

const DifficultyModal = ({ isOpen, onClose }) => {
    const { startNewGame, isWon, timerSeconds, setIsPaused, difficulty } = useGame();

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
            <div className="relative rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-pop-in border-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}>
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: 'var(--text-base)' }}>New Game</h2>
                    <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Select a difficulty level to start.</p>

                    <div className="space-y-3">
                        {hasActiveGame && (
                            <button
                                onClick={() => {
                                    setIsPaused(false);
                                    onClose();
                                }}
                                className="w-full py-3 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md border-2 flex flex-col items-center justify-center gap-1"
                                style={{ backgroundColor: 'var(--border-thick)', borderColor: 'var(--border-thin)' }}
                            >
                                <span className="text-lg font-bold">Continue Game</span>
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider px-3 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                                    <span>{difficulty}</span>
                                    <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                                    <span>{formatTime(timerSeconds)}</span>
                                </div>
                            </button>
                        )}
                        <div className="border-t my-4 pt-4" style={{ borderColor: 'var(--border-thin)' }} hidden={!hasActiveGame}></div>

                        <button
                            onClick={() => onSelectDifficulty('easy')}
                            className="w-full py-4 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:brightness-95"
                            style={{ backgroundColor: 'var(--bg-easy)', color: 'var(--text-easy)' }}
                        >
                            Easy
                        </button>
                        <button
                            onClick={() => onSelectDifficulty('medium')}
                            className="w-full py-4 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:brightness-95"
                            style={{ backgroundColor: 'var(--bg-medium)', color: 'var(--text-medium)' }}
                        >
                            Medium
                        </button>
                        <button
                            onClick={() => onSelectDifficulty('hard')}
                            className="w-full py-4 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:brightness-95"
                            style={{ backgroundColor: 'var(--bg-hard)', color: 'var(--text-hard)' }}
                        >
                            Hard
                        </button>
                    </div>

                    {!hasActiveGame && (
                        <button
                            onClick={onClose}
                            className="mt-6 text-sm font-medium transition-colors hover:opacity-80"
                            style={{ color: 'var(--text-muted)' }}
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
