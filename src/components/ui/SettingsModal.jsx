
import React from 'react';

import { useGame } from '../../context/GameContext';

const SettingsModal = ({ isOpen, onClose }) => {
    const { autoRemoveNotes, setAutoRemoveNotes, showHighlights, setShowHighlights, maxHints, setMaxHints } = useGame();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Card */}
            <div
                className="relative rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-pop-in border-4 overflow-hidden"
                style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}
            >
                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-extrabold mb-6 tracking-tight" style={{ color: 'var(--text-base)' }}>Settings</h2>

                    <div className="space-y-6">
                        {/* Smart Note Auto-Removal Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-200" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold" style={{ color: 'var(--text-base)' }}>Smart Notes</span>
                                <span className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>Auto-remove from row, column & cage</span>
                            </div>
                            <button
                                onClick={() => setAutoRemoveNotes(!autoRemoveNotes)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${autoRemoveNotes ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                style={{ backgroundColor: autoRemoveNotes ? 'var(--primary-accent)' : '' }}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${autoRemoveNotes ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {/* Highlight Areas Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-200" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold" style={{ color: 'var(--text-base)' }}>Highlight Areas</span>
                                <span className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>Highlight row & column</span>
                            </div>
                            <button
                                onClick={() => setShowHighlights(!showHighlights)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${showHighlights ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                style={{ backgroundColor: showHighlights ? 'var(--primary-accent)' : '' }}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${showHighlights ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {/* Max Hints Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-200" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-bold" style={{ color: 'var(--text-base)' }}>Max Hints</span>
                                <span className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>Allowed hints per game</span>
                            </div>
                            <button
                                onClick={() => setMaxHints(maxHints === 3 ? 5 : 3)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none`}
                                style={{ backgroundColor: maxHints === 5 ? 'var(--primary-accent)' : 'var(--text-muted)' }}
                            >
                                <span
                                    className={`flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-sm text-xs font-bold transition-transform duration-200 ${maxHints === 5 ? 'translate-x-7' : 'translate-x-1'}`}
                                    style={{ color: maxHints === 5 ? 'var(--primary-accent)' : 'var(--text-muted)' }}
                                >
                                    {maxHints}
                                </span>
                            </button>
                        </div>

                        {/* Future settings can go here */}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-8 w-full py-4 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        style={{ backgroundColor: 'var(--primary-accent)' }}
                    >
                        Close
                    </button>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--primary-accent)' }}></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--primary-accent)' }}></div>
            </div>
        </div >
    );
};

export default SettingsModal;
