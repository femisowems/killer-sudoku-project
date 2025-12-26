# Killer Sudoku

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-4.x-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38b2ac)

A modern, responsive implementation of Killer Sudoku built with React and Tailwind CSS. Experience the classic puzzle game with a polished UI, smart helpers, and real-time validation.

<p align="center">
  <img src="./public/assets/demo.webp" width="100%" alt="Killer Sudoku Gameplay Demo">
</p>

- **Classic Killer Sudoku Rules**: Fill the grid so that every row, column, and 3x3 box contains digits 1-9. Dashed "cages" must sum to the specified target number without repeating digits.
- **True Procedural Generation**:
    - **Dynamic Cages**: Every game generates a unique cage layout. You'll never play the same grid twice.
    - **Difficulty Scaling**:
        - **Easy**: Smaller cages (pairs/triples) for a quick game.
        - **Medium**: Balanced mix of cage sizes.
        - **Hard**: Complex, winding cages that challenge your logic.
- **Rich Gameplay Features**:
    - **Smart Notes**: Toggle notes mode to track candidates. Includes optional "Smart Auto-Remove" to clear notes when you place a number.
    - **Themes**: Choose from curated color themes like Platinum, Seashell, or Onyx.
    - **Statistics**: Track your games played, win rate, and best times.
    - **Cage Combinations**: View valid number combinations for any selected cage to help deduce the solution.
    - **Pause/Resume**: Take a break without losing your progress.
- **Modern UI/UX**:
    - **Real-time Validation**: Highlights conflicts in rows, columns, boxes, or cages.
    - **Responsive Design**: Optimized for desktop, tablet, and mobile.
    - **PWA Support**: Installable as a native-like app on your device.
    - **Win Celebration**: Confetti animation upon victory.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (`useState`, `useReducer`, `useCallback`, `useEffect`)
- **Icons**: Lucide React

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/femisowems/killer-sudoku-project.git
   cd killer-sudoku-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Key Components

- `SudokuBoard`: The core grid component handling rendering and interactions.
- `SudokuCell`: Individual cell component with logic for borders, selection, and computed styling.
- `GameContext`: Centralized state management for the game board, timer, and difficulty.
- `DifficultySelectionModal`: Modal for choosing game difficulty.
- `ControlPanel`: UI for game controls (New Game, Pause, Check, etc.).

## License

MIT
