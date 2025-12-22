
import React from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

import { useGame } from '../../context/GameContext';

const WinModal = ({ isOpen, onClose, onViewSolved }) => {
    const { timerSeconds, mistakes, difficulty } = useGame();
    // Map props to context values
    const timeSeconds = timerSeconds;

    React.useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-slate-100 overflow-hidden"
                    >
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
                                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 active:scale-[0.98]"
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WinModal;
