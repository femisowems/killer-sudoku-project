import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { useGame } from '../../context/GameContext';

const GamePausedModal = ({ isOpen }) => {
    // Note: isOpen and onResume passed from App because App controls modal rendering?
    // Actually, isPaused is in context, so we could check context.isPaused instead of props.isOpen.
    // togglePause is also in context.
    const { isPaused, togglePause, timerSeconds, mistakes, difficulty } = useGame();

    // We can rely on context for open state and resume action
    if (!isPaused) return null;

    // Use context values and override if needed
    const timeSeconds = timerSeconds;
    if (!isOpen) return null;

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isPaused && isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={togglePause}
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
                        {/* Decorative Background blobs - simplified/themed */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--primary-accent)' }}></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--primary-accent)' }}></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
                                ⏸️
                            </div>

                            <h2 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: 'var(--text-base)' }}>Game Paused</h2>
                            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Take a break! The timer is paused.</p>

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

                            <button
                                onClick={togglePause}
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 active:scale-[0.98]"
                            >
                                Resume Game
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GamePausedModal;
