import React from 'react';

import { useGame } from '../../context/GameContext';

const GameInfo = () => {
    const { timerSeconds, mistakes, difficulty, showTimer, showMistakes } = useGame();
    // Map props
    const timeSeconds = timerSeconds;
    // Format seconds into MM:SS
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="rounded-2xl shadow-sm border flex flex-col w-full overflow-hidden mb-6 animate-fade-in" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}>
            {/* Flex container for items */}
            <div className="flex divide-x" style={{ borderColor: 'var(--border-thin)' }}>

                {/* Time */}
                {showTimer && (
                    <div className="flex-1 p-4 flex flex-col items-center justify-center relative group" style={{ backgroundColor: 'var(--bg-app)' }}>
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Time</span>
                        <div id="timer-display" className="text-xl font-mono font-bold flex items-center gap-2" style={{ color: 'var(--text-base)' }}>
                            {formatTime(timeSeconds)}
                        </div>
                    </div>
                )}

                {/* Mistakes */}
                {showMistakes && (
                    <div className="flex-1 p-4 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-app)' }}>
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Mistakes</span>
                        <div id="mistakes-display" className={`text-xl font-mono font-bold ${mistakes > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {mistakes}
                        </div>
                    </div>
                )}

                {/* Difficulty */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-app)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Difficulty</span>
                    <div id="difficulty-display" className="text-sm font-bold capitalize" style={{ color: 'var(--text-base)' }}>
                        {difficulty}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default React.memo(GameInfo);
