
import React from 'react';

const WinModal = ({ isOpen, onClose, onViewSolved, timeSeconds, mistakes, difficulty }) => {
    if (!isOpen) return null;

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-pop-in border-4 border-emerald-100 overflow-hidden">
                {/* Decorative Background blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                        👑
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Solved!</h2>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Fantastic job! You've successfully completed this Killer Sudoku puzzle.
                    </p>

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

                    <div className="space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transform transition hover:-translate-y-1 active:scale-[0.98]"
                        >
                            Play Another Game
                        </button>
                        <button
                            onClick={onViewSolved}
                            className="w-full py-3 bg-transparent hover:bg-slate-50 text-slate-500 font-semibold rounded-xl border border-transparent hover:border-slate-200 transition-colors"
                        >
                            View Solved
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WinModal;
