# Killer Sudoku

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-4.x-purple)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38b2ac)

A modern, responsive implementation of Killer Sudoku built with React, Tailwind CSS, and Supabase. Experience the classic puzzle game with a polished UI, smart helpers, real-time validation, and cloud-synced player profiles.

<p align="center">
  <img src="./public/assets/demo.webp" width="100%" alt="Killer Sudoku Gameplay Demo">
</p>

## Features

### 🧩 Core Gameplay
- **Classic Killer Sudoku Rules**: Fill the grid so that every row, column, and 3x3 box contains digits 1-9. Dashed "cages" must sum to the specified target number without repeating digits.
- **True Procedural Generation**:
    - **Dynamic Cages**: Every game generates a unique cage layout. You'll never play the same grid twice.
    - **Difficulty Scaling**: From quick "Easy" puzzles to complex "Expert" challenges.

### 👤 User Experience
- **User Accounts**: Sign up or log in to create a persistent player profile.
- **Cloud Sync**: Your game statistics and history are synced across all your devices.
- **Rich Statistics**:
    - **Detailed breakdown**: Track games started, wins, win rate, best times, and average times for each difficulty level.
    - **Visualizations**: Beautiful dashboard to view your progress.
- **Themes**: Choose from curated color themes like Platinum, Seashell, or Onyx.

### 🛠 Tools & Helpers
- **Smart Notes**: Toggle notes mode to track candidates. Includes optional "Smart Auto-Remove".
- **Cage Combinations**: View valid number combinations for any selected cage to help deduce the solution.
- **Real-time Validation**: Instantly highlights conflicts in rows, columns, boxes, or cages.

### 💻 Modern Tech
- **Responsive Design**: Optimized for desktop, tablet, and mobile.
- **PWA Support**: Installable as a native-like app on your device.
- **Smooth Animations**: Powered by Framer Motion for a premium feel.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Backend/Auth**: Supabase
- **State Management**: React Context + Hooks
- **Animations**: Framer Motion
- **Visualization**: Recharts
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

3. **Environment Setup:**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Key Components

- `SudokuBoard`: The core grid component handling rendering and interactions.
- `UserProfileModal`: Handles interaction with user profiles, authentication, and stats display.
- `GameContext`: Centralized state management for the game board, timer, and difficulty.
- `AuthContext`: Manages user authentication state and Supabase session.

## License

MIT
