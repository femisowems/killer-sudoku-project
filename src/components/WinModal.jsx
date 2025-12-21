
import React from 'react';

const WinModal = ({ isOpen, onClose, onViewSolved }) => {
    if (!isOpen) return null;

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
