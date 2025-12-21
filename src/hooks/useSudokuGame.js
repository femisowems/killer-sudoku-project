
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    generateValidBoard,
    generatePuzzle
} from '../logic/sudoku-generator';
import {
    isStandardConflict,
    isCageConflict
} from '../logic/sudoku-validation';
import {
    CAGE_SHAPES
} from '../constants/sudoku-constants';

export function useSudokuGame(initialDifficulty = 'medium') {
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [board, setBoard] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [cages, setCages] = useState([]);
    const [startingCells, setStartingCells] = useState([]);
    const [hintedCells, setHintedCells] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [status, setStatus] = useState({ message: '', type: 'info' });
    const [isWon, setIsWon] = useState(false);
    const [cellToCageIndex, setCellToCageIndex] = useState(Array(9).fill(0).map(() => Array(9).fill(-1)));
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isAutoSolved, setIsAutoSolved] = useState(false);

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

    // Initialize game
    const startNewGame = useCallback((diff = difficulty) => {
        setDifficulty(diff);
        setIsWon(false);
        setIsAutoSolved(false); // Reset auto-solve flag
        setHintedCells([]);
        setSelectedCell(null);
        setTimerSeconds(0);
        setIsTimerRunning(true);
        setIsPaused(false);

        // 1. Generate solution
        const newSolution = generateValidBoard();
        setSolutionBoard(newSolution);

        // 2. Calculate cage sums
        const newCages = CAGE_SHAPES.map(cage => {
            const sum = cage.cells.reduce((acc, [r, c]) => acc + newSolution[r][c], 0);
            return { ...cage, sum };
        });
        setCages(newCages);

        // 3. Map cells to cages
        const newCellToCage = Array(9).fill(0).map(() => Array(9).fill(-1));
        newCages.forEach((cage, index) => {
            cage.cells.forEach(([r, c]) => {
                newCellToCage[r][c] = index;
            });
        });
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

        setStatus({ message: `New ${diff.charAt(0).toUpperCase() + diff.slice(1)} game started. Good luck!`, type: 'info' });
    }, [difficulty]);

    // Initial load
    useEffect(() => {
        startNewGame(initialDifficulty);
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

        const newBoard = [...board.map(row => [...row])];
        newBoard[r][c] = number;
        setBoard(newBoard);

        // Check for immediate win (optional here, but good for feedback)
        // We'll leave win check to a separate effect or function call
    }, [selectedCell, isFixed, board]);

    const handleHint = useCallback(() => {
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
        setStatus({ message: `Hint applied: The correct number is ${correctValue}.`, type: 'success' });
    }, [selectedCell, isFixed, solutionBoard, board, hintedCells]);

    const checkErrors = useCallback(() => {
        let standardErrors = 0;
        let cageErrors = 0;
        let isFull = true;

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) isFull = false;
                if (isStandardConflict(board, r, c)) standardErrors++;
            }
        }

        cages.forEach((_, index) => {
            if (isCageConflict(cages, board, index)) cageErrors++;
        });

        if (standardErrors + cageErrors > 0) {
            setStatus({ message: `Found ${standardErrors} standard Sudoku violations and ${cageErrors} cage rule violations.`, type: 'error' });
            return false;
        } else if (!isFull) {
            setStatus({ message: 'No errors found, but the puzzle is not complete yet.', type: 'info' });
            return false;
        } else {
            setIsWon(true);
            setIsTimerRunning(false);
            setStatus({ message: 'The board is full and error-free! You solved it!', type: 'success' });
            return true;
        }
    }, [board, cages]);

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
    const mistakes = useMemo(() => {
        let count = 0;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                // A mistake is a non-empty cell that does not match the solution
                if (board[r][c] !== 0 && board[r][c] !== solutionBoard[r][c]) {
                    count++;
                }
            }
        }
        return count;
    }, [board, solutionBoard]);

    return {
        board,
        cages,
        cellToCageIndex,
        selectedCell,
        status,
        isWon,
        isAutoSolved,
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
        togglePause
    };
}
