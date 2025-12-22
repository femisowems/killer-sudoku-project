
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
        <div className="p-4 rounded-xl border shadow-sm w-full mb-4 animate-fade-in transition-all" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}>
            <div
                className="flex justify-between items-center mb-4 cursor-pointer group"
                onClick={() => setViewDetail(!viewDetail)}
                title="Toggle Details"
            >
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-base)' }}>
                    <span>Statistics</span>
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full lowercase transition-colors" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
                        {difficulty}
                    </span>
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${viewDetail ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Best Time</span>
                    <span className="font-mono font-bold text-lg" style={{ color: 'var(--text-base)' }}>{formatTime(currentStats.best)}</span>
                </div>
                <div className="p-3 rounded-lg border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Avg Time</span>
                    <span className="font-mono font-bold text-lg" style={{ color: 'var(--text-base)' }}>{formatTime(currentStats.avg)}</span>
                </div>
            </div>

            {viewDetail && (
                <div className="grid grid-cols-2 gap-4 mt-4 animate-fade-in-down">
                    <div className="p-3 rounded-lg border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                        <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Played</span>
                        <span className="font-bold text-lg" style={{ color: 'var(--text-base)' }}>{currentStats.played}</span>
                    </div>
                    <div className="p-3 rounded-lg border flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                        <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Win Rate</span>
                        <span className="font-bold text-lg" style={{ color: 'var(--text-base)' }}>{currentStats.winRate}%</span>
                    </div>

                    {/* Mini History Chart - Recharts Area Chart */}
                    <div className="col-span-2 mt-4 w-full">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
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
                                                <stop offset="5%" stopColor="var(--primary-accent)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary-accent)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="text-white text-xs p-2 rounded shadow-lg" style={{ backgroundColor: 'var(--border-thick)' }}>
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
                                            stroke="var(--primary-accent)"
                                            fillOpacity={1}
                                            fill="url(#colorTime)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs border border-dashed rounded" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-thin)' }}>
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
