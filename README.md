# Killer Sudoku

A modern, responsive implementation of Killer Sudoku built with React and Tailwind CSS.

<p align="center">
  <img src="./public/assets/demo.webp" width="80%">
</p>

## Features

- **Classic Killer Sudoku Rules**: Fill the grid so that every row, column, and 3x3 box contains digits 1-9. Additionally, dashed "cages" must sum to the specified target number without repeating digits.
- **Dynamic Puzzle Generation**: Generates new puzzles on demand with varying difficulty levels (Easy, Medium, Hard).
- **Responsive Design**: optimized for both desktop and mobile, featuring a flexible 3-column layout on large screens.
- **Smart Highlighting**: Visual cues for selected cells, related cages, and error conflicts.
- **Helper Tools**: 
    - **Cage Combinations**: View valid number combinations for any selected cage.
    - **Hint System**: Get unstuck with built-in hints.
- **Keyboard support**: Navigate the grid using arrow keys.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`)

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

- `SudokuBoard`: Renders the main grid and handles interaction.
- `SudokuCell`: Individual cell component with complex logic for borders, highlighting, and input.
- `Controls`: Game controls for difficulty, new game, and number input.
- `CageCombinations`: Helper component to show math combinations for cages.
- `sudokuLogic.js`: Core game logic including generation and validation.

## License

MIT
