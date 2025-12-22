
import React from 'react';
import confetti from 'canvas-confetti';
// eslint-disable-next-line no-unused-vars
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

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

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
                        className="relative rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}
                    >
                        {/* Decorative Background blobs - themed */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--primary-accent)' }}></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ backgroundColor: 'var(--primary-accent)' }}></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner" style={{ backgroundColor: 'var(--bg-app)' }}>
                                👑
                            </div>

                            <h2 className="text-3xl font-extrabold mb-3 tracking-tight" style={{ color: 'var(--text-base)' }}>Solved!</h2>

                            <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Fantastic job! You've successfully completed this Killer Sudoku puzzle.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-8">
                                <div className="p-3 rounded-2xl border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Time</span>
                                    <span className="font-mono font-bold text-lg" style={{ color: 'var(--text-base)' }}>{formatTime(timeSeconds)}</span>
                                </div>
                                <div className="p-3 rounded-2xl border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Mistakes</span>
                                    <span className={`font-mono font-bold text-lg ${mistakes > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{mistakes}</span>
                                </div>
                                <div className="p-3 rounded-2xl border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Mode</span>
                                    <span className="font-bold capitalize text-sm h-[28px] flex items-center" style={{ color: 'var(--text-base)' }}>{difficulty}</span>
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
                                    className="w-full py-3 bg-transparent font-semibold rounded-xl border transition-all"
                                    style={{ color: 'var(--text-muted)', borderColor: 'transparent' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                                        e.currentTarget.style.borderColor = 'var(--border-thin)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
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
