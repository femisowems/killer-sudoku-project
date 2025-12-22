import { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { getCageCombinations } from '../../logic/sudoku-validation';

const CageCombinations = ({ onHighlightCage }) => {
    const { cages, cellToCageIndex, selectedCell } = useGame();

    // Derive active cage
    let cage = null;
    let cageIndex = -1;
    if (selectedCell) {
        cageIndex = cellToCageIndex[selectedCell.r][selectedCell.c];
        cage = cages[cageIndex];
    }

    const combinations = useMemo(() => {
        if (!cage) return [];
        return getCageCombinations(cage.sum, cage.cells.length);
    }, [cage]);

    if (!cage) {
        return (
            <div className="p-4 rounded-2xl shadow-sm border min-h-[100px] flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)', color: 'var(--text-muted)' }}>
                Select a cell to view cage strategies
            </div>
        );
    }

    return (
        <div
            className="p-4 rounded-2xl shadow-sm border animate-fade-in"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)' }}
            onClick={() => onHighlightCage(cageIndex)}
        >
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-base)' }}>Cage Strategy</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sum {cage.sum} in {cage.cells.length} cells</p>
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
                            className="px-2 py-1 border rounded-lg text-sm font-mono hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer"
                            style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)', color: 'var(--text-base)' }}
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
