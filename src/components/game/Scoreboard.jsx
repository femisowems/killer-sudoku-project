
import React, { useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

import { useGame } from '../../context/GameContext';

const Scoreboard = () => {
    const { difficulty, stats } = useGame(); // Consume stats from context
    const [viewDetail, setViewDetail] = useState(false);

    const getStatsForLevel = (level) => {
        const s = stats[level] || { started: 0, wins: [] };
        const wins = s.wins;
        const best = wins.length > 0 ? Math.min(...wins) : null;
        const avg = wins.length > 0 ? Math.floor(wins.reduce((a, b) => a + b, 0) / wins.length) : null;
        const winRate = s.started > 0 ? Math.round((wins.length / s.started) * 100) : 0;
        return { best, avg, winRate, played: s.started };
    };

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const currentStats = getStatsForLevel(difficulty);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full mb-4 animate-fade-in transition-all">
            <div
                className="flex justify-between items-center mb-4 cursor-pointer group"
                onClick={() => setViewDetail(!viewDetail)}
                title="Toggle Details"
            >
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span>Statistics</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full lowercase group-hover:bg-slate-200 transition-colors">
                        {difficulty}
                    </span>
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transform transition-transform ${viewDetail ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-wider">Best Time</span>
                    <span className="font-mono font-bold text-emerald-700 text-lg">{formatTime(currentStats.best)}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-blue-600/70 tracking-wider">Avg Time</span>
                    <span className="font-mono font-bold text-blue-700 text-lg">{formatTime(currentStats.avg)}</span>
                </div>
            </div>

            {viewDetail && (
                <div className="grid grid-cols-2 gap-4 mt-4 animate-fade-in-down">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Played</span>
                        <span className="font-bold text-slate-700 text-lg">{currentStats.played}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Win Rate</span>
                        <span className="font-bold text-slate-700 text-lg">{currentStats.winRate}%</span>
                    </div>

                    {/* Mini History Chart - Recharts Area Chart */}
                    <div className="col-span-2 mt-4 w-full">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Win History {stats[difficulty].wins.length > 20 ? '(Last 20)' : ''}
                        </h4>
                        <div className="h-24 w-full">
                            {stats[difficulty].wins.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={stats[difficulty].wins.slice(-20).map((t, i) => {
                                            const totalWins = stats[difficulty].wins.length;
                                            const startIndex = Math.max(0, totalWins - 20);
                                            return { index: startIndex + i + 1, time: t };
                                        })}
                                    >
                                        <defs>
                                            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg">
                                                            <p className="font-bold">Win #{payload[0].payload.index}</p>
                                                            <p>Time: {formatTime(payload[0].value)}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="time"
                                            stroke="#4f46e5"
                                            fillOpacity={1}
                                            fill="url(#colorTime)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded">
                                    Win a game to see your history!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scoreboard;
