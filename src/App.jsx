
import React from 'react';
import Header from './components/layout/Header';
import Board from './components/game/Board';
import Controls from './components/game/Controls';
import StatusMessage from './components/ui/StatusMessage';
import GameWonModal from './components/ui/GameWonModal';
import GamePausedModal from './components/ui/GamePausedModal';
import DifficultySelectionModal from './components/ui/DifficultySelectionModal';
import CageCombinations from './components/game/CageCombinations';
import GameInfo from './components/game/GameInfo';
import Scoreboard from './components/game/Scoreboard';
import SettingsModal from './components/ui/SettingsModal';
import InstallPWA from './components/InstallPWA';
import GameLayout from './components/layout/GameLayout';
import { useGame } from './context/GameContext';

const THEME_COLORS = {
  platinum: '#EBEBEB',
  seashell: '#f7efe9',
  onyx: '#0f0f0f'
};

function App() {
  const {
    isWon, selectedCell, difficulty,
    isPaused, setIsPaused, timerSeconds,
    theme
  } = useGame();

  const [showWinModal, setShowWinModal] = React.useState(false);
  const [showNewGameModal, setShowNewGameModal] = React.useState(true);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const [highlightedCageIndex, setHighlightedCageIndex] = React.useState(null);

  // Clear highlight when selection changes or board updates
  React.useEffect(() => {
    setHighlightedCageIndex(null);
  }, [selectedCell, difficulty]);

  // Pause game when New Game Modal is open
  React.useEffect(() => {
    if (showNewGameModal && !isPaused && !isWon) {
      setIsPaused(true);
    }
  }, [showNewGameModal, isPaused, isWon, setIsPaused, timerSeconds]);

  React.useEffect(() => {
    setShowWinModal(isWon);
  }, [isWon]);

  // Apply theme to document root for global CSS variables
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Update PWA theme color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_COLORS[theme]);
    }
  }, [theme]);

  // --- Props for Layout ---

  const sidebarContent = (
    <>
      <Scoreboard />
      <CageCombinations
        onHighlightCage={(idx) => setHighlightedCageIndex(idx)}
      />

      {/* Instructions / Tips */}
      <div className="p-4 rounded-xl border text-xs" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)', color: 'var(--text-muted)' }}>
        <p className="mb-2 font-semibold" style={{ color: 'var(--text-base)' }}>How to play:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Normal Sudoku rules apply.</li>
          <li>Numbers in cages must sum to the target.</li>
          <li>Numbers in a cage cannot repeat.</li>
        </ul>
      </div>
    </>
  );

  const modalsContent = (
    <>
      <GamePausedModal
        isOpen={isPaused && !showNewGameModal}
      />

      <GameWonModal
        isOpen={showWinModal}
        onClose={() => setShowNewGameModal(true)}
        onViewSolved={() => setShowWinModal(false)}
      />

      <DifficultySelectionModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );

  const footerContent = (
    <footer className="mt-12 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
      <p>
        Made by <a href="https://ssowemimo.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" style={{ color: 'var(--text-base)' }}>Femi Sowems</a>
      </p>
    </footer>
  );

  return (
    <GameLayout
      header={<Header />}
      gameInfo={<GameInfo />}
      controls={<Controls />}
      board={<Board highlightedCageIndex={highlightedCageIndex} />}
      statusMessage={<StatusMessage message={useGame().status.message} type={useGame().status.type} />}
      sidebar={sidebarContent}
      modals={modalsContent}
      footer={footerContent}
      installPWA={<InstallPWA />}
      onSettingsClick={() => setShowSettingsModal(true)}
      onNewGameClick={() => setShowNewGameModal(true)}
    />
  );
}

export default App;
