
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    generateValidBoard,
    generatePuzzle
} from '../logic/sudoku-generator';

import {
    CAGE_SHAPES
} from '../constants/sudoku-constants';
import { saveGameState, loadGameState, clearGameState } from '../utils/storage';

export function useSudokuGame(initialDifficulty = 'medium') {
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [board, setBoard] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [cages, setCages] = useState([]);
    const [startingCells, setStartingCells] = useState([]);
    const [hintedCells, setHintedCells] = useState([]);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [notes, setNotes] = useState(Array(9).fill(0).map(() => Array(9).fill(new Set())));
    const [isNotesMode, setIsNotesMode] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [status, setStatus] = useState({ message: '', type: 'info' });
    const [isWon, setIsWon] = useState(false);
    const [cellToCageIndex, setCellToCageIndex] = useState(Array(9).fill(0).map(() => Array(9).fill(-1)));
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isAutoSolved, setIsAutoSolved] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [mistakes, setMistakes] = useState(0);

    // Worker Ref
    const workerRef = useRef(null);

    // Initialize Worker
    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/puzzle.worker.js', import.meta.url), { type: 'module' });

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'validationResult') {
                const { unique, solutionCount } = payload;
                if (!unique) {
                    console.warn(`Generated puzzle has ${solutionCount} solutions. It might not be a valid Sudoku.`);
                    // Optionally set a status message here, but careful not to spam user
                } else {
                    console.log('Puzzle validated: Unique solution found.');
                }
            }
        };

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    // Helper to calculate cage sums and map cells to cages
    const setupCagesAndMap = (solution) => {
        // Calculate cage sums
        const newCages = CAGE_SHAPES.map(cage => {
            const sum = cage.cells.reduce((acc, [r, c]) => acc + solution[r][c], 0);
            return { ...cage, sum };
        });

        // Map cells to cages
        const newCellToCage = Array(9).fill(0).map(() => Array(9).fill(-1));
        newCages.forEach((cage, index) => {
            cage.cells.forEach(([r, c]) => {
                newCellToCage[r][c] = index;
            });
        });

        return { cages: newCages, cellToCageIndex: newCellToCage };
    };

    // Initialize game
    const startNewGame = useCallback((diff = difficulty) => {
        setDifficulty(diff);
        setIsWon(false);
        setIsAutoSolved(false); // Reset auto-solve flag
        setShowErrors(false); // Reset error showing
        setHintedCells([]);
        setHintsRemaining(3);
        setSelectedCell(null);
        setTimerSeconds(0);
        setIsTimerRunning(true);
        setIsPaused(false);
        setMistakes(0);
        setNotes(Array(9).fill(0).map(() => Array(9).fill(new Set()))); // Reset notes
        setIsNotesMode(false); // Reset notes mode

        // 1. Generate solution
        const newSolution = generateValidBoard();
        setSolutionBoard(newSolution);

        // Calculate and set derived cage data
        const { cages: newCages, cellToCageIndex: newCellToCage } = setupCagesAndMap(newSolution);
        setCages(newCages);
        setCellToCageIndex(newCellToCage);

        // 4. Setup starting board
        const startingCoords = generatePuzzle(diff);
        setStartingCells(startingCoords);

        const newBoard = Array(9).fill(0).map(() => Array(9).fill(0));
        startingCoords.forEach(([r, c]) => {
            newBoard[r][c] = newSolution[r][c];
        });
        setBoard(newBoard);

        // Validate Puzzle in Background
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'validate',
                payload: { board: newBoard }
            });
        }

        // Clear any saved state
        clearGameState();

        setStatus({ message: `New ${diff.charAt(0).toUpperCase() + diff.slice(1)} game started. Good luck!`, type: 'info' });
    }, [difficulty]);

    // Restore game from saved state
    const restoreGame = useCallback((savedState) => {
        // Validation: Ensure core data exists to prevent crash
        if (!savedState || !savedState.solutionBoard || savedState.solutionBoard.length !== 9) {
            console.error('Saved state is invalid or corrupted. Starting new game.');
            clearGameState();
            startNewGame(initialDifficulty);
            return;
        }

        setDifficulty(savedState.difficulty);
        setBoard(savedState.board);
        setSolutionBoard(savedState.solutionBoard);
        setStartingCells(savedState.startingCells);
        setHintedCells(savedState.hintedCells);
        setHintsRemaining(savedState.hintsRemaining);
        setNotes(savedState.notes);
        setMistakes(savedState.mistakes);
        setTimerSeconds(savedState.timerSeconds);
        setIsTimerRunning(true); // Resume timer on load
        setIsPaused(savedState.isPaused); // Or maybe force pause? Let's keep saved state.
        setIsWon(savedState.isWon);
        setIsAutoSolved(savedState.isAutoSolved);

        // Cages and CellMap must be derived from solution (or constants)
        try {
            const { cages: restoredCages, cellToCageIndex: restoredMap } = setupCagesAndMap(savedState.solutionBoard);
            setCages(restoredCages);
            setCellToCageIndex(restoredMap);
        } catch (e) {
            console.error('Failed to reconstruct cages from saved solution:', e);
            clearGameState();
            startNewGame(initialDifficulty);
            return;
        }

        setStatus({ message: 'Game restored', type: 'info' });

        // Re-validate if needed
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'validate',
                payload: { board: savedState.board }
            });
        }

    }, [startNewGame, initialDifficulty]);

    // Initial load - check storage first
    useEffect(() => {
        const savedState = loadGameState();
        if (savedState) {
            restoreGame(savedState);
        } else {
            startNewGame(initialDifficulty);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Timer Interval
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && !isWon && !isPaused) {
            interval = setInterval(() => {
                setTimerSeconds(s => s + 1);
            }, 1000);
        } else if ((!isTimerRunning || isPaused) && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, isWon, isPaused]);

    // Automatic Win Detection
    useEffect(() => {
        if (isWon) return;

        // Check if board is full (no zeros)
        const isFull = board.every(row => row.every(cell => cell !== 0));
        if (!isFull) return;

        // Check correctness
        const isCorrect = board.every((row, r) =>
            row.every((cell, c) => cell === solutionBoard[r][c])
        );

        if (isCorrect) {
            setIsWon(true);
            setIsTimerRunning(false);
            setStatus({ message: 'Congratulations! You solved it!', type: 'success' });
        }
    }, [board, solutionBoard, isWon]);

    // Idle Timer (5 minutes)
    const idleTimerRef = useRef(null);

    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        // Only set timer if not won and not already paused
        if (!isWon && !isPaused) {
            idleTimerRef.current = setTimeout(() => {
                setIsPaused(true);
                // Optional: alert or status update? Usually modal is sufficient.
            }, 300000); // 5 minutes = 300,000 ms
        }
    }, [isWon, isPaused]);

    useEffect(() => {
        // Events to detect activity
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'click'];
        const handleActivity = () => resetIdleTimer();

        events.forEach(event => window.addEventListener(event, handleActivity));

        // Initialize timer
        resetIdleTimer();

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [resetIdleTimer]);

    // Auto-Save Effect
    useEffect(() => {
        // Don't save if empty or won (handled by clearGameState on new game, but saving won game is fine for review)
        if (board.length === 0) return;

        const stateToSave = {
            difficulty,
            board,
            solutionBoard,
            startingCells,
            hintedCells,
            hintsRemaining,
            notes,
            mistakes,
            timerSeconds,
            isPaused,
            isWon,
            isAutoSolved
        };
        saveGameState(stateToSave);
    }, [board, notes, mistakes, hintsRemaining, isPaused, isWon, difficulty, timerSeconds /* Adding timerSeconds ensures exact save on tick, but might be heavy. Let's rely on event listeners for exact time or 1s lag is acceptable. Actually, including timerSeconds means writing to localstorage every second. Better to EXCLUDE timerSeconds from dependency and only save when other things change OR on unload */]);

    // Save on Unload / Visibility Change to capture Timer
    useEffect(() => {
        const handleSave = () => {
            const stateToSave = {
                difficulty,
                board,
                solutionBoard,
                startingCells,
                hintedCells,
                hintsRemaining,
                notes,
                mistakes,
                timerSeconds, // Captures current timer
                isPaused,
                isWon,
                isAutoSolved
            };
            saveGameState(stateToSave);
        };

        window.addEventListener('visibilitychange', handleSave);
        window.addEventListener('pagehide', handleSave);
        return () => {
            window.removeEventListener('visibilitychange', handleSave);
            window.removeEventListener('pagehide', handleSave);
        };
    }, [difficulty, board, solutionBoard, startingCells, hintedCells, hintsRemaining, notes, mistakes, timerSeconds, isPaused, isWon, isAutoSolved]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedCell) return;

            const { r, c } = selectedCell;
            let newR = r;
            let newC = c;

            if (e.key === 'ArrowUp') {
                newR = Math.max(0, r - 1);
            } else if (e.key === 'ArrowDown') {
                newR = Math.min(8, r + 1);
            } else if (e.key === 'ArrowLeft') {
                newC = Math.max(0, c - 1);
            } else if (e.key === 'ArrowRight') {
                newC = Math.min(8, c + 1);
            } else {
                return; // Not an arrow key
            }

            e.preventDefault(); // Prevent scrolling
            setSelectedCell({ r: newR, c: newC });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell]);

    const handleCellSelect = useCallback((r, c) => {
        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
            setSelectedCell(null); // Deselect if clicking same cell
        } else {
            setSelectedCell({ r, c });
        }
    }, [selectedCell]);

    const isFixed = useCallback((r, c) => {
        if (startingCells.some(([sr, sc]) => sr === r && sc === c)) return 'prefilled';
        if (hintedCells.some(([hr, hc]) => hr === r && hc === c)) return 'hinted';
        return false;
    }, [startingCells, hintedCells]);

    const handleNumberInput = useCallback((number) => {
        if (!selectedCell) {
            setStatus({ message: 'Please select a cell first.', type: 'info' });
            return;
        }

        const { r, c } = selectedCell;

        if (isFixed(r, c)) {
            setStatus({ message: 'You cannot change a fixed starting or hinted number.', type: 'error' });
            return;
        }

        // Avoid unnecessary updates
        if (!isNotesMode && board[r][c] === number) return;

        // Notes Mode Logic
        if (isNotesMode) {
            // Cannot add notes to a cell with a value
            if (board[r][c] !== 0) return;

            const currentNotes = new Set(notes[r][c]);
            if (currentNotes.has(number)) {
                currentNotes.delete(number);
            } else {
                currentNotes.add(number);
            }

            const newNotes = [...notes.map(row => [...row])];
            newNotes[r][c] = currentNotes;
            setNotes(newNotes);
            return;
        }

        // Standard Input Mode
        const newBoard = [...board.map(row => [...row])];
        newBoard[r][c] = number;
        setBoard(newBoard);

        // Clear notes for this cell when a number is placed
        if (number !== 0) {
            const newNotes = [...notes.map(row => [...row])];
            newNotes[r][c] = new Set();
            setNotes(newNotes);
        }

        // Track mistakes
        if (number !== 0 && number !== solutionBoard[r][c]) {
            setMistakes(prev => prev + 1);
        }

        // Check for immediate win (optional here, but good for feedback)
        // We'll leave win check to a separate effect or function call
    }, [selectedCell, isFixed, board, solutionBoard, isNotesMode, notes]);

    const toggleNotesMode = useCallback(() => {
        setIsNotesMode(prev => !prev);
    }, []);

    const handleHint = useCallback(() => {
        if (hintsRemaining <= 0) {
            setStatus({ message: 'No hints remaining!', type: 'info' });
            return;
        }
        if (!selectedCell) {
            setStatus({ message: 'Please select an empty cell to get a hint.', type: 'info' });
            return;
        }
        const { r, c } = selectedCell;

        if (isFixed(r, c)) {
            setStatus({ message: 'This cell already has a fixed value.', type: 'info' });
            return;
        }

        const correctValue = solutionBoard[r][c];
        const newBoard = [...board.map(row => [...row])];
        newBoard[r][c] = correctValue;
        setBoard(newBoard);
        setHintedCells([...hintedCells, [r, c]]);
        setHintsRemaining(prev => prev - 1);
        setStatus({ message: `Hint applied: The correct number is ${correctValue}.`, type: 'success' });
    }, [selectedCell, isFixed, solutionBoard, board, hintedCells, hintsRemaining]);

    const checkErrors = useCallback(() => {
        // If already won, do nothing
        if (isWon) return;

        // Toggle error showing
        const newShowErrors = !showErrors;
        setShowErrors(newShowErrors);

        if (newShowErrors) {
            setStatus({ message: 'Real-time error checking ON.', type: 'info' });
        } else {
            setStatus({ message: 'Real-time error checking OFF.', type: 'info' });
        }
    }, [showErrors, isWon]);

    const solveGame = useCallback(() => {
        // Create a copy of the solution board
        const solvedBoard = solutionBoard.map(row => [...row]);
        setBoard(solvedBoard);
        setIsWon(true);
        setIsAutoSolved(true); // Mark as auto-solved
        setIsTimerRunning(false);
        setStatus({ message: 'Solved! Use "New Game" to play again.', type: 'success' });
    }, [solutionBoard]);

    const togglePause = useCallback(() => {
        if (!isWon) {
            setIsPaused(prev => !prev);
        }
    }, [isWon]);

    // Calculate visible mistakes (dynamic conflict count)
    // Calculate visible mistakes (dynamic conflict count) - REMOVED in favor of persistent state
    // const mistakes = useMemo(...)

    return {
        board,
        solutionBoard,
        cages,
        cellToCageIndex,
        selectedCell,
        status,
        isWon,
        isAutoSolved,
        showErrors,
        difficulty,
        startNewGame,
        handleCellSelect,
        handleNumberInput,
        handleHint,
        checkErrors,
        isFixed,
        solveGame,
        timerSeconds,
        mistakes,

        isPaused,
        togglePause,
        notes,
        isNotesMode,

        toggleNotesMode,
        hintsRemaining,
    };
}
