
import React from 'react';
import Header from './components/Header';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import StatusMessage from './components/StatusMessage';
import WinModal from './components/WinModal';
import CageCombinations from './components/CageCombinations';
import { useSudokuGame } from './hooks/useSudokuGame';

function App() {
  const {
    board, cages, cellToCageIndex, selectedCell,
    status, isWon, difficulty,
    startNewGame, handleCellSelect, handleNumberInput, handleHint, checkErrors, isFixed, solveGame
  } = useSudokuGame();

  const [showWinModal, setShowWinModal] = React.useState(false);
  const [highlightedCageIndex, setHighlightedCageIndex] = React.useState(null);

  // Clear highlight when selection changes or board updates
  React.useEffect(() => {
    setHighlightedCageIndex(null);
  }, [selectedCell, difficulty]);

  React.useEffect(() => {
    if (isWon) {
      setShowWinModal(true);
    } else {
      setShowWinModal(false);
    }
  }, [isWon]);

  return (
    <div id="app-root" className="bg-background min-h-screen flex flex-col items-center py-10 px-4 font-sans text-slate-800">
      {/* Header & Status */}
      <header id="game-header" className="flex flex-col items-center space-y-4 w-full max-w-[800px]">
        <Header />
        {/* StatusMessage moved to below grid for alignment */}
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 w-full max-w-[1200px] mt-8">

        {/* Left Column: Controls */}
        <section id="controls-area" className="w-full max-w-[800px] xl:w-80 flex-shrink-0">
          <Controls
            difficulty={difficulty}
            setDifficulty={(d) => startNewGame(d)}
            onNumberInput={handleNumberInput}
            onHint={handleHint}
            onCheck={checkErrors}
            onNewGame={startNewGame}
            onClear={() => handleNumberInput(0)}
            onSolve={solveGame}
          />
        </section>

        {/* Center Column: Game Board */}
        <main id="game-board-area" className="flex flex-col items-center w-full flex-grow">
          <SudokuBoard
            board={board}
            cages={cages}
            cellToCageIndex={cellToCageIndex}
            selectedCell={selectedCell}
            onSelect={handleCellSelect}
            isFixed={isFixed}
            highlightedCageIndex={highlightedCageIndex}
          />
          <div className="mt-4 w-full flex justify-center">
            <StatusMessage message={status.message} type={status.type} />
          </div>
        </main>

        {/* Right Column: Strategies */}
        <aside id="sidebar-strategies" className="w-full max-w-[800px] xl:w-64 flex-shrink-0 flex flex-col gap-4">
          <CageCombinations
            cage={selectedCell ? cages[cellToCageIndex[selectedCell.r][selectedCell.c]] : null}
            cageIndex={selectedCell ? cellToCageIndex[selectedCell.r][selectedCell.c] : -1}
            onHighlightCage={(idx) => setHighlightedCageIndex(idx)}
          />

          {/* Instructions / Tips */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500">
            <p className="mb-2 font-semibold">How to play:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Normal Sudoku rules apply.</li>
              <li>Numbers in cages must sum to the target.</li>
              <li>Numbers in a cage cannot repeat.</li>
            </ul>
          </div>
        </aside>

      </div>

      <WinModal
        isOpen={showWinModal}
        onClose={() => startNewGame(difficulty)}
        onViewSolved={() => setShowWinModal(false)}
      />
    </div >
  );
}

export default App;
