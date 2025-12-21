import React, { useMemo } from 'react';
import { getCageCombinations } from '../utils/sudokuLogic';

const CageCombinations = ({ cage, cageIndex, onHighlightCage }) => {
    if (!cage) {
        return (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-h-[100px] flex items-center justify-center text-slate-400 text-sm">
                Select a cell to view cage strategies
            </div>
        );
    }

    const combinations = useMemo(() => {
        return getCageCombinations(cage.sum, cage.cells.length);
    }, [cage.sum, cage.cells.length]);

    return (
        <div
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-fade-in"
            onClick={() => onHighlightCage(cageIndex)}
        >
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Cage Strategy</h3>
                    <p className="text-xs text-slate-500">Sum {cage.sum} in {cage.cells.length} cells</p>
                </div>
            </div>

            {combinations.length === 0 ? (
                <p className="text-sm text-rose-500">Impossible Cage!</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {combinations.map((combo, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                onHighlightCage(cageIndex);
                            }}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer"
                        >
                            {combo.join(' + ')}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CageCombinations;
