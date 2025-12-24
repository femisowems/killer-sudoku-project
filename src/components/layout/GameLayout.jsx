import React from 'react';
import GameActionButtons from '../game/GameActionButtons';
import ThemePicker from '../ui/ThemePicker';

const GameLayout = ({
    header,
    gameInfo,
    controls,
    board,
    statusMessage,
    sidebar,
    modals,
    footer,
    installPWA,
    onSettingsClick,
    onNewGameClick // Passed down for the buttons
}) => {
    return (
        <div
            id="app-root"
            className="min-h-screen flex flex-col items-center py-6 px-2 md:py-6 md:px-4 lg:py-10 font-sans transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-app)' }}
        >
            {/* Top Right Controls (Fixed) */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 flex flex-col gap-2">
                <ThemePicker />
                <button
                    onClick={onSettingsClick}
                    className="p-2 rounded-full transition-all shadow-sm border hover:brightness-95 active:scale-95"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-thin)', color: 'var(--text-base)' }}
                    title="Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Header & Status */}
            <header id="game-header" className="flex flex-col items-center space-y-4 w-full max-w-[800px]">
                {header}
            </header>

            {/* Main Layout Container */}
            <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-3 w-full max-w-[1200px] mt-4 md:mt-8">

                {/* Mobile-only Game Info */}
                <div id="mobile-game-info-container" className="w-full max-w-[800px] xl:hidden order-1">
                    {gameInfo}
                </div>

                {/* Left Column: Controls */}
                <section id="controls-area" className="w-full max-w-[800px] xl:w-80 flex-shrink-0 flex flex-col items-center order-3 xl:order-1">
                    {/* Desktop-only Game Info */}
                    <div id="desktop-game-info-container" className="hidden xl:block w-full">
                        {gameInfo}
                    </div>

                    <div id="controls-numbers-container" className="w-full">
                        {controls}
                    </div>

                    {/* Mobile-only Action Buttons */}
                    <div id="mobile-action-buttons" className="w-full max-w-lg mt-6 grid grid-cols-4 gap-4 xl:hidden">
                        <GameActionButtons onNewGame={onNewGameClick} />
                    </div>
                </section>

                {/* Center Column: Game Board */}
                <main id="game-board-area" className="flex flex-col items-center w-full flex-grow order-2 xl:order-2">
                    {board}
                    <div className="mt-4 w-full flex justify-center">
                        {statusMessage}
                    </div>

                    {/* Desktop-only Action Buttons */}
                    <div id="desktop-action-buttons" className="w-full max-w-lg mt-6 hidden xl:grid grid-cols-4 gap-4">
                        <GameActionButtons onNewGame={onNewGameClick} />
                    </div>
                </main>

                {/* Right Column: Strategies */}
                <aside id="sidebar-strategies" className="w-full max-w-[800px] xl:w-64 flex-shrink-0 flex flex-col gap-4 order-3 xl:order-3">
                    {sidebar}
                </aside>

            </div>

            {/* Modals & Portals */}
            {modals}

            {/* Footer */}
            {footer}

            {installPWA}
        </div>
    );
};

export default GameLayout;
