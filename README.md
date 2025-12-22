# Killer Sudoku

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-4.x-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38b2ac)

A modern, responsive implementation of Killer Sudoku built with React and Tailwind CSS. Experience the classic puzzle game with a polished UI, smart helpers, and real-time validation.

<p align="center">
  <img src="./public/assets/demo.webp" width="100%" alt="Killer Sudoku Gameplay Demo">
</p>

## Features

- **Classic Killer Sudoku Rules**: Fill the grid so that every row, column, and 3x3 box contains digits 1-9. Dashed "cages" must sum to the specified target number without repeating digits.
- **Dynamic Puzzle Generation**: Instantly generate new puzzles with selectable difficulty levels:
    - **Easy**: Great for beginners.
    - **Medium**: A balanced challenge.
    - **Hard**: For Sudoku veterans.
- **Smart Highlighting**: 
    - Real-time error detection for row/column/box and cage sum conflicts.
    - Visual cues for selected cells and related cages.
- **Helpful Tools**:
    - **Mistakes Counter**: Keep track of your errors (optional validation).
    - **Notes Mode**: Annotate cells with potential numbers (coming soon). 
    - **Cage Combinations**: View valid number combinations for any selected cage to help deduce the solution.
    - **Pause/Resume**: Take a break without losing your progress (blurs board to prevent peeking).
- **Responsive Design**: Fully optimized for desktop and mobile devices. Features a flexible layout that adapts to screen size.
- **Keyboard Support**: Full navigation using arrow keys and number input.
- **Win Celebration**: Confetti animation upon successfully completing the puzzle.

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
