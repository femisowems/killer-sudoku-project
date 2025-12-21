
import React from 'react';
import Header from './components/Header';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import StatusMessage from './components/StatusMessage';
import WinModal from './components/WinModal';
import DifficultyModal from './components/DifficultyModal';
import CageCombinations from './components/CageCombinations';
import GameInfo from './components/GameInfo';
import { useSudokuGame } from './hooks/useSudokuGame';

function App() {
  const {
    board, cages, cellToCageIndex, selectedCell,
    status, isWon, difficulty, timerSeconds, mistakes,
    startNewGame, handleCellSelect, handleNumberInput, handleHint, checkErrors, isFixed, solveGame
  } = useSudokuGame();

  const [showWinModal, setShowWinModal] = React.useState(false);
  const [showNewGameModal, setShowNewGameModal] = React.useState(false);
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
        <section id="controls-area" className="w-full max-w-[800px] xl:w-80 flex-shrink-0 flex flex-col items-center">
          <GameInfo
            timeSeconds={timerSeconds}
            mistakes={mistakes}
            difficulty={difficulty}
          />

          <Controls
            onNumberInput={handleNumberInput}
            onClear={() => handleNumberInput(0)}
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

          {/* Action Buttons (Moved Here) */}
          <div className="w-full max-w-lg mt-6 grid grid-cols-4 gap-4">
            <button
              onClick={() => setShowNewGameModal(true)}
              className="py-3 px-2 bg-slate-800 text-white font-semibold rounded-xl shadow hover:bg-slate-900 active:scale-[0.98] transition-all text-sm sm:text-base"
            >
              New Game
            </button>
            <button
              onClick={checkErrors}
              className="py-3 px-2 bg-white text-slate-700 border border-slate-200 font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all text-sm sm:text-base"
            >
              Check
            </button>
            <button
              onClick={handleHint}
              className="py-3 px-2 bg-amber-100 text-amber-700 font-semibold rounded-xl shadow-sm hover:bg-amber-200 active:scale-[0.98] transition-all text-sm sm:text-base"
            >
              Hint
            </button>
            <button
              onClick={solveGame}
              className="py-3 px-2 bg-rose-100 text-rose-700 font-semibold rounded-xl shadow-sm hover:bg-rose-200 active:scale-[0.98] transition-all text-sm sm:text-base"
            >
              Solve
            </button>
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
        onClose={() => setShowNewGameModal(true)}
        onViewSolved={() => setShowWinModal(false)}
      />

      <DifficultyModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onSelectDifficulty={(diff) => {
          startNewGame(diff);
          setShowNewGameModal(false);
        }}
      />
    </div >
  );
}

export default App;
