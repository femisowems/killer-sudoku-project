import React from 'react';
import Header from './components/layout/Header';
import Board from './components/game/Board';
import Controls from './components/game/Controls';
import StatusMessage from './components/ui/StatusMessage';
import GameWonModal from './components/ui/GameWonModal';
import DifficultySelectionModal from './components/ui/DifficultySelectionModal';
import CageCombinations from './components/game/CageCombinations';
import GameInfo from './components/game/GameInfo';
import Scoreboard from './components/game/Scoreboard';
import { useSudokuGame } from './hooks/useSudokuGame';

function App() {
  const {
    board, solutionBoard, cages, cellToCageIndex, selectedCell,
    status, isWon, difficulty, timerSeconds, mistakes, isPaused, isAutoSolved, showErrors,
    startNewGame, handleCellSelect, handleNumberInput, handleHint, checkErrors, isFixed, solveGame, togglePause
  } = useSudokuGame();

  // Calculate counts of each number on the board
  const numberCounts = React.useMemo(() => {
    const counts = Array(10).fill(0);
    board.forEach(row => {
      row.forEach(val => {
        if (val >= 1 && val <= 9) counts[val]++;
      });
    });
    return counts;
  }, [board]);

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
    <div id="app-root" className="bg-background min-h-screen flex flex-col items-center py-6 px-2 md:py-10 md:px-4 font-sans text-slate-800">
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
            numberCounts={numberCounts}
          />
        </section>

        {/* Center Column: Game Board */}
        <main id="game-board-area" className="flex flex-col items-center w-full flex-grow">
          <Board
            board={board}
            solutionBoard={solutionBoard}
            showErrors={showErrors}
            cages={cages}
            cellToCageIndex={cellToCageIndex}
            selectedCell={selectedCell}
            onSelect={handleCellSelect}
            isFixed={isFixed}
            highlightedCageIndex={highlightedCageIndex}
            isPaused={isPaused}
            onTogglePause={togglePause}
          />
          <div className="mt-4 w-full flex justify-center">
            <StatusMessage message={status.message} type={status.type} />
          </div>

          {/* Action Buttons (Moved Here) */}
          <div className="w-full max-w-lg mt-6 grid grid-cols-4 gap-4">
            <button
              onClick={() => setShowNewGameModal(true)}
              className="py-3 px-2 bg-slate-800 text-white font-semibold rounded-xl shadow hover:bg-slate-900 active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              New
            </button>
            <button
              onClick={checkErrors}
              className={`py-3 px-2 font-semibold rounded-xl shadow-sm active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-2 border whitespace-nowrap ${showErrors ? 'bg-rose-100 text-rose-700 border-rose-200 ring-2 ring-rose-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${showErrors ? 'text-rose-500' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Check
            </button>
            <button
              onClick={handleHint}
              className="py-3 px-2 bg-amber-100 text-amber-900 font-semibold rounded-xl shadow-sm hover:bg-amber-200 active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
              Hint
            </button>

            {/* Pause & Solve Group */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              <button
                onClick={togglePause}
                className={`flex-1 flex items-center justify-center rounded-lg active:scale-95 transition-all shadow-sm ${isPaused ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:text-primary'}`}
                title={isPaused ? "Resume Game" : "Pause Game"}
              >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" /></svg>
                )}
              </button>
              <button
                onClick={solveGame}
                className="flex-1 flex items-center justify-center bg-white text-rose-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all shadow-sm"
                title="Solve Puzzle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Right Column: Strategies */}
        <aside id="sidebar-strategies" className="w-full max-w-[800px] xl:w-64 flex-shrink-0 flex flex-col gap-4">
          <Scoreboard
            difficulty={difficulty}
            isWon={isWon}
            timerSeconds={timerSeconds}
            isAutoSolved={isAutoSolved}
          />

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

      <GameWonModal
        isOpen={showWinModal}
        onClose={() => setShowNewGameModal(true)}
        onViewSolved={() => setShowWinModal(false)}
      />

      <DifficultySelectionModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onSelectDifficulty={(diff) => {
          startNewGame(diff);
          setShowNewGameModal(false);
        }}
      />
    </div>
  );
}

export default App;
