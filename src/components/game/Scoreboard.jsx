
import React, { useState, useEffect } from 'react';

import { useGame } from '../../context/GameContext';

const Scoreboard = () => {
    const { difficulty, isWon, timerSeconds, isAutoSolved } = useGame();
    const [bestTimes, setBestTimes] = useState({
        easy: null,
        medium: null,
        hard: null
    });

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('killerSudokuBestTimes');
        if (saved) {
            setBestTimes(JSON.parse(saved));
        }
    }, []);

    // Update best time on win
    useEffect(() => {
        if (isWon && !isAutoSolved) {
            setBestTimes(prev => {
                const currentBest = prev[difficulty];
                if (currentBest === null || timerSeconds < currentBest) {
                    const newTimes = { ...prev, [difficulty]: timerSeconds };
                    localStorage.setItem('killerSudokuBestTimes', JSON.stringify(newTimes));
                    return newTimes;
                }
                return prev;
            });
        }
    }, [isWon, difficulty, timerSeconds, isAutoSolved]);

    const formatTime = (seconds) => {
        if (seconds === null) return '--:--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full mb-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2 flex justify-between items-center">
                <span>Best Times</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
                {['easy', 'medium', 'hard'].map(level => (
                    <div key={level} className={`flex flex-col p-2 rounded-lg transition-colors ${difficulty === level ? 'bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200' : 'bg-slate-50'}`}>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{level}</span>
                        <span className={`text-sm font-mono font-bold ${difficulty === level ? 'text-primary' : 'text-slate-600'}`}>
                            {formatTime(bestTimes[level])}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Scoreboard;
