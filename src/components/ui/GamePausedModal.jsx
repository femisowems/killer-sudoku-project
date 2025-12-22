import React from 'react';

import { useGame } from '../../context/GameContext';

const GamePausedModal = ({ isOpen, onResume }) => {
    // Note: isOpen and onResume passed from App because App controls modal rendering?
    // Actually, isPaused is in context, so we could check context.isPaused instead of props.isOpen.
    // togglePause is also in context.
    const { isPaused, togglePause, timerSeconds, mistakes, difficulty } = useGame();

    // We can rely on context for open state and resume action
    if (!isPaused) return null;

    // Use context values and override if needed
    const timeSeconds = timerSeconds;
    const handleResume = togglePause;
    if (!isOpen) return null;

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onResume}></div>

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-pop-in border-4 border-slate-100 overflow-hidden">
                {/* Decorative Background blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner text-slate-400">
                        ⏸️
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Game Paused</h2>
                    <p className="text-slate-500 mb-8">Take a break! The timer is paused.</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-8">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time</span>
                            <span className="font-mono font-bold text-slate-700 text-lg">{formatTime(timeSeconds)}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mistakes</span>
                            <span className={`font-mono font-bold text-lg ${mistakes > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{mistakes}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mode</span>
                            <span className="font-bold text-slate-700 capitalize text-sm h-[28px] flex items-center">{difficulty}</span>
                        </div>
                    </div>

                    <button
                        onClick={onResume}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 active:scale-[0.98]"
                    >
                        Resume Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePausedModal;
