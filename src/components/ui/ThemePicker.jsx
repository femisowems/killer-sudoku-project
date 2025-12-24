import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const ThemePicker = () => {
    const { theme, setTheme } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const themes = [
        { id: 'platinum', color: '#EBEBEB', label: 'Platinum', ring: 'ring-slate-300' },
        { id: 'seashell', color: '#f7efe9', label: 'Seashell', ring: 'ring-amber-200' },
        { id: 'onyx', color: '#0f0f0f', label: 'Onyx', ring: 'ring-slate-600' }
    ];

    return (
        <div className="relative z-50">
            <button
                onClick={toggleOpen}
                className="p-2 rounded-full transition-all shadow-sm border hover:brightness-95 active:scale-95"
                style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)', color: 'var(--text-base)' }}
                title="Change Theme"
                aria-label="Change Theme"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 mt-2 p-2 rounded-xl shadow-xl border flex flex-col gap-2 min-w-[140px]"
                        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}
                    >
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:brightness-95"
                                style={{
                                    backgroundColor: theme === t.id ? 'var(--bg-app)' : 'transparent',
                                    color: 'var(--text-base)'
                                }}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full border shadow-sm ${t.ring}`}
                                    style={{ backgroundColor: t.color }}
                                />
                                <span className="text-sm font-medium">{t.label}</span>
                                {theme === t.id && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary ml-auto" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemePicker;
