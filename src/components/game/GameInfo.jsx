import React from 'react';

const GameInfo = ({ timeSeconds, mistakes, difficulty }) => {
    // Format seconds into MM:SS
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col w-full overflow-hidden mb-6 animate-fade-in">
            {/* Grid for 3 items */}
            <div className="grid grid-cols-3 divide-x divide-slate-100">

                {/* Time */}
                <div className="p-4 flex flex-col items-center justify-center bg-slate-50/50 relative group">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                    <div id="timer-display" className="text-xl font-mono font-bold text-slate-700 flex items-center gap-2">
                        {formatTime(timeSeconds)}
                    </div>
                </div>

                {/* Mistakes */}
                <div className="p-4 flex flex-col items-center justify-center bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mistakes</span>
                    <div id="mistakes-display" className={`text-xl font-mono font-bold ${mistakes > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {mistakes}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="p-4 flex flex-col items-center justify-center bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Difficulty</span>
                    <div id="difficulty-display" className="text-sm font-bold text-slate-700 capitalize">
                        {difficulty}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default React.memo(GameInfo);
