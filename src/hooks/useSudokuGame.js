
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    generateValidBoard,
    generatePuzzle
} from '../logic/sudoku-generator';
import {
    isRowComplete,
    isColumnComplete,
    isBoxComplete,
    checkRelatedGroups,
    getAffectedGroupIds
} from '../logic/sudoku-validation';

import { generateCages } from '../logic/cage-generator';
import { calculateSmartNoteUpdates } from '../logic/game-logic';
import { saveGameState, loadGameState, clearGameState } from '../utils/storage';
import { useTimer } from './useTimer';
import { useWorker } from './useWorker';
import { useHistory } from './useHistory';

/**
 * Main game hook managing Sudoku state, validation, and history.
 * @param {string} initialDifficulty - 'easy', 'medium', 'hard'
 */
export function useSudokuGame(initialDifficulty = 'medium') {
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [board, setBoard] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [cages, setCages] = useState([]);
    const [startingCells, setStartingCells] = useState([]);
    const [hintedCells, setHintedCells] = useState([]);

    // Derived state for hints
    const [maxHints, setMaxHints] = useState(3);
    const [hintsUsed, setHintsUsed] = useState(0);
    const hintsRemaining = maxHints - hintsUsed;

    const [notes, setNotes] = useState(Array(9).fill(0).map(() => Array(9).fill(new Set())));
    const [isNotesMode, setIsNotesMode] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [status, setStatus] = useState({ message: '', type: 'info' });
    const [isWon, setIsWon] = useState(false);
    const [cellToCageIndex, setCellToCageIndex] = useState(Array(9).fill(0).map(() => Array(9).fill(-1)));

    const [isAutoSolved, setIsAutoSolved] = useState(false);
    const [showErrors, setShowErrors] = useState(true);
    const [mistakes, setMistakes] = useState(0);
    const [autoRemoveNotes, setAutoRemoveNotes] = useState(true);
    const [showHighlights, setShowHighlights] = useState(true);

    // Animation State
    const [animatingGroups, setAnimatingGroups] = useState(new Set());
    const completedGroupsRef = useRef(new Set());

    // --- Composed Hooks ---
    // --- Composed Hooks ---
    const {
        timerSeconds,
        isPaused,
        setIsPaused,
        togglePause,
        resetTimer,
        stopTimer,
        startTimer,
        setTimerSeconds
    } = useTimer();

    const { validateBoard } = useWorker();

    const {
        history,
        future,
        addToHistory: addToHistoryStack,
        handleUndo,
        handleRedo,
        resetHistory,
        setHistory,
        setFuture
    } = useHistory();

    // Helper: Calculate currently completed groups without triggering animation
    const getCompletedGroupsSet = (currentBoard) => {
        const completed = new Set();
        // Check Rows
        for (let r = 0; r < 9; r++) {
            if (isRowComplete(currentBoard, r)) completed.add(`row-${r}`);
        }
        // Check Cols
        for (let c = 0; c < 9; c++) {
            if (isColumnComplete(currentBoard, c)) completed.add(`col-${c}`);
        }
        // Check Boxes
        for (let br = 0; br < 3; br++) {
            for (let bc = 0; bc < 3; bc++) {
                if (isBoxComplete(currentBoard, br * 3, bc * 3)) completed.add(`box-${br}-${bc}`);
            }
        }
        return completed;
    };

    // Logic to check completions and animate
    const checkAndAnimateCompletions = (newBoard, r, c) => {
        const foundNewCompletions = [];

        // Use helper to check only relevant groups
        const currentlyCompleteIds = new Set(checkRelatedGroups(newBoard, r, c));
        const potentiallyAffectedIds = getAffectedGroupIds(r, c);

        potentiallyAffectedIds.forEach(id => {
            if (currentlyCompleteIds.has(id)) {
                // It is complete now. Was it complete before?
                if (!completedGroupsRef.current.has(id)) {
                    foundNewCompletions.push(id);
                }
                completedGroupsRef.current.add(id);
            } else {
                // It is NOT complete now.
                completedGroupsRef.current.delete(id);
            }
        });

        // Trigger Animation for NEWLY completed
        if (foundNewCompletions.length > 0) {
            // Haptics for mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            setAnimatingGroups(prev => {
                const next = new Set(prev);
                foundNewCompletions.forEach(id => next.add(id));
                return next;
            });
            setTimeout(() => {
                setAnimatingGroups(prev => {
                    const next = new Set(prev);
                    foundNewCompletions.forEach(id => next.delete(id));
                    return next;
                });
            }, 1000);
        }
    };

    // Initialize game
    const startNewGame = useCallback((diff = difficulty) => {
        setDifficulty(diff);
        setIsWon(false);
        setIsAutoSolved(false); // Reset auto-solve flag
        setShowErrors(true); // Reset error showing (default ON)
        setHintedCells([]);
        setHintsUsed(0);
        setSelectedCell(null);
        setMistakes(0);
        setNotes(Array(9).fill(0).map(() => Array(9).fill(new Set()))); // Reset notes
        setIsNotesMode(false); // Reset notes mode

        // Reset Animation State
        setAnimatingGroups(new Set());
        completedGroupsRef.current = new Set();

        // Reset sub-hooks
        resetTimer();
        resetHistory();

        // 1. Generate solution
        const newSolution = generateValidBoard();
        setSolutionBoard(newSolution);

        // 2. Generate Dynamic Cages
        // This is the core difficulty logic improvement
        const newCagesBase = generateCages(diff, newSolution);

        // Calculate cage sums based on solution
        const newCages = newCagesBase.map((cage, index) => {
            const sum = cage.cells.reduce((acc, [r, c]) => acc + newSolution[r][c], 0);
            return { ...cage, sum };
        });

        // 3. Map cells to cages
        const newCellToCage = Array(9).fill(0).map(() => Array(9).fill(-1));
        newCages.forEach((cage, index) => {
            cage.cells.forEach(([r, c]) => {
                newCellToCage[r][c] = index;
            });
        });

        setCages(newCages);
        setCellToCageIndex(newCellToCage);

        // 4. Setup starting board using dynamic cages for constraint
        const startingCoords = generatePuzzle(diff, newCages);
        setStartingCells(startingCoords);

        const newBoard = Array(9).fill(0).map(() => Array(9).fill(0));
        startingCoords.forEach(([r, c]) => {
            newBoard[r][c] = newSolution[r][c];
        });
        setBoard(newBoard);

        // Pre-fill completed groups from start
        completedGroupsRef.current = getCompletedGroupsSet(newBoard);

        // Validate Puzzle in Background
        validateBoard(newBoard);

        // Clear any saved state
        clearGameState();

        setStatus({ message: `New ${diff.charAt(0).toUpperCase() + diff.slice(1)} game started. Good luck!`, type: 'info' });
    }, [difficulty, resetTimer, resetHistory, validateBoard]);

    // Restore game from saved state
    const restoreGame = useCallback((savedState) => {
        // Validation: Ensure core data exists to prevent crash
        if (!savedState || !savedState.solutionBoard || savedState.solutionBoard.length !== 9) {
            console.error('Saved state is invalid or corrupted. Starting new game.');
            clearGameState();
            startNewGame(initialDifficulty);
            return;
        }

        // New Logic: Check for dynamic cages in save
        // If missing (legacy save), we can't faithfully restore the exact visual state without CAGE_SHAPES constant.
        // For now, we will restart if cages are missing to avoid broken UI.
        if (!savedState.cages) {
            console.warn('Legacy save file detected (no cages). Starting new game to ensure compatibility.');
            clearGameState();
            startNewGame(initialDifficulty);
            return;
        }

        setDifficulty(savedState.difficulty);
        setBoard(savedState.board);
        setSolutionBoard(savedState.solutionBoard);
        setStartingCells(savedState.startingCells);
        setHintedCells(savedState.hintedCells);

        if (savedState.hintsUsed !== undefined) {
            setHintsUsed(savedState.hintsUsed);
        } else if (savedState.hintsRemaining !== undefined) {
            setHintsUsed(3 - savedState.hintsRemaining);
        }
        if (savedState.maxHints !== undefined) {
            setMaxHints(savedState.maxHints);
        }
        setNotes(savedState.notes);
        setMistakes(savedState.mistakes);

        // Restore sub-hooks
        setHistory(savedState.history || []);
        setFuture([]);
        setTimerSeconds(savedState.timerSeconds);
        startTimer();

        setIsPaused(savedState.isPaused);
        setIsWon(savedState.isWon);
        setIsAutoSolved(savedState.isAutoSolved);
        if (savedState.autoRemoveNotes !== undefined) {
            setAutoRemoveNotes(savedState.autoRemoveNotes);
        }
        if (savedState.showHighlights !== undefined) {
            setShowHighlights(savedState.showHighlights);
        }

        completedGroupsRef.current = getCompletedGroupsSet(savedState.board);

        // Restore Cages directly
        setCages(savedState.cages);

        // Rebuild Cell Map from restored cages
        // This is safer than saving the map which is large redundancy
        const restoredMap = Array(9).fill(0).map(() => Array(9).fill(-1));
        savedState.cages.forEach((cage, index) => {
            cage.cells.forEach(([r, c]) => {
                restoredMap[r][c] = index;
            });
        });
        setCellToCageIndex(restoredMap);

        setStatus({ message: 'Game restored', type: 'info' });

        // Re-validate if needed
        validateBoard(savedState.board);

    }, [startNewGame, initialDifficulty, setHistory, setFuture, setTimerSeconds, startTimer, setIsPaused, validateBoard]);

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
            stopTimer();
            setStatus({ message: 'Congratulations! You solved it!', type: 'success' });
        }
    }, [board, solutionBoard, isWon, stopTimer]);

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
    }, [isWon, isPaused, setIsPaused]);

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
    // Helper to get current game state for saving
    // Auto-Save Effect
    // Helper to get current game state for saving
    const getGameState = useCallback(() => {
        return {
            difficulty,
            board,
            solutionBoard,
            cages, // Save dynamic cages
            startingCells,
            hintedCells,
            hintsRemaining,
            notes,
            mistakes,
            timerSeconds,
            isPaused,
            isWon,
            isAutoSolved,
            autoRemoveNotes,
            showHighlights,
            maxHints,
            hintsUsed,
            history
        };
    }, [difficulty, board, solutionBoard, cages, startingCells, hintedCells, hintsRemaining, notes, mistakes, timerSeconds, isPaused, isWon, isAutoSolved, autoRemoveNotes, showHighlights, maxHints, hintsUsed, history]);

    // Auto-Save Effect
    useEffect(() => {
        // Don't save if empty or won (handled by clearGameState on new game, but saving won game is fine for review)
        if (board.length === 0) return;
        // Enforce 10s minimum playtime to avoid saving ephemeral starts
        if (timerSeconds <= 10) return;

        saveGameState(getGameState());
    }, [getGameState, board, timerSeconds]);

    // Save on Unload / Visibility Change to capture Timer
    useEffect(() => {
        const handleSave = () => {
            // Enforce 10s minimum playtime to avoid saving ephemeral starts
            if (timerSeconds <= 10) return;
            saveGameState(getGameState());
        };

        window.addEventListener('visibilitychange', handleSave);
        window.addEventListener('pagehide', handleSave);
        return () => {
            window.removeEventListener('visibilitychange', handleSave);
            window.removeEventListener('pagehide', handleSave);
        };

    }, [getGameState, timerSeconds]);

    // History Helpers
    const performAddToHistory = useCallback(() => {
        // Deep copy board and notes (notes are Set, so need careful copy)
        const currentBoard = board.map(row => [...row]);
        const currentNotes = notes.map(row => row.map(set => new Set(set)));

        addToHistoryStack({ board: currentBoard, notes: currentNotes });
    }, [board, notes, addToHistoryStack]);

    const undo = useCallback(() => {
        const previousState = handleUndo({
            board: board.map(row => [...row]),
            notes: notes.map(row => row.map(set => new Set(set)))
        }, isPaused, isWon);

        if (previousState) {
            setBoard(previousState.board);
            setNotes(previousState.notes);
            // Silent update of completed groups
            completedGroupsRef.current = getCompletedGroupsSet(previousState.board);
        }
    }, [handleUndo, board, notes, isPaused, isWon]);

    const redo = useCallback(() => {
        const nextState = handleRedo({
            board: board.map(row => [...row]),
            notes: notes.map(row => row.map(set => new Set(set)))
        }, isPaused, isWon);

        if (nextState) {
            setBoard(nextState.board);
            setNotes(nextState.notes);
            // Silent update of completed groups
            completedGroupsRef.current = getCompletedGroupsSet(nextState.board);
        }
    }, [handleRedo, board, notes, isPaused, isWon]);

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
        // Prevent modification if game is already won
        if (isWon) {
            setStatus({ message: 'Game is already won!', type: 'success' });
            return;
        }

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

        // Determine change
        if (isNotesMode) {
            // Cannot add notes to a cell with a value
            if (board[r][c] !== 0) return;

            // Save state before changing notes
            performAddToHistory();

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
        // Save state before changing board
        performAddToHistory();

        const newBoard = [...board.map(row => [...row])];
        newBoard[r][c] = number;
        setBoard(newBoard);

        // Track mistakes (User rule: Mistakes always increase, never undo)
        if (number !== 0 && number !== solutionBoard[r][c]) {
            setMistakes(prev => prev + 1);
        }

        // --- Smart Note Auto-Removal ---
        if (autoRemoveNotes && number !== 0) {
            const finalNotes = calculateSmartNoteUpdates(notes, r, c, number, cellToCageIndex, cages);
            setNotes(finalNotes);
        } else if (number !== 0) {
            // Standard single-cell note clear if auto-removal is off
            const newNotes = notes.map(row => row.map(set => new Set(set)));
            newNotes[r][c] = new Set();
            setNotes(newNotes);
        }

        // Check animations
        checkAndAnimateCompletions(newBoard, r, c);

        // Check for immediate win (optional here, but good for feedback)
        // We'll leave win check to a separate effect or function call
    }, [selectedCell, isFixed, board, solutionBoard, isNotesMode, notes, performAddToHistory, autoRemoveNotes, cages, cellToCageIndex]);

    const toggleNotesModeArg = useCallback(() => {
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
        setHintsUsed(prev => prev + 1);
        setStatus({ message: `Hint applied: The correct number is ${correctValue}.`, type: 'success' });

        checkAndAnimateCompletions(newBoard, r, c);
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
        stopTimer();
        setStatus({ message: 'Solved! Use "New Game" to play again.', type: 'success' });
    }, [solutionBoard, stopTimer]);

    // Keyboard Navigation (Moved here to ensure handlers are defined)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore keyboard events if modifiers are pressed (Cmd, Ctrl, etc.)
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            // Global Hotkeys
            if (e.key.toLowerCase() === 'p') {
                togglePause();
                return;
            }

            // If game is paused or won, block other inputs
            if (isPaused || isWon) return;

            // Note Mode Toggle
            if (e.key.toLowerCase() === 'n') {
                toggleNotesModeArg();
                return;
            }

            // The rest requires a selected cell
            if (!selectedCell) return;

            const { r, c } = selectedCell;
            let newR = r;
            let newC = c;

            // Navigation
            if (e.key === 'ArrowUp') {
                newR = Math.max(0, r - 1);
                e.preventDefault();
                setSelectedCell({ r: newR, c: newC });
                return;
            } else if (e.key === 'ArrowDown') {
                newR = Math.min(8, r + 1);
                e.preventDefault();
                setSelectedCell({ r: newR, c: newC });
                return;
            } else if (e.key === 'ArrowLeft') {
                newC = Math.max(0, c - 1);
                e.preventDefault();
                setSelectedCell({ r: newR, c: newC });
                return;
            } else if (e.key === 'ArrowRight') {
                newC = Math.min(8, c + 1);
                e.preventDefault();
                setSelectedCell({ r: newR, c: newC });
                return;
            }

            // Number Input
            if (e.key >= '1' && e.key <= '9') {
                handleNumberInput(parseInt(e.key, 10));
                return;
            }

            // Delete / Backspace
            if (e.key === 'Backspace' || e.key === 'Delete') {
                handleNumberInput(0);
                return;
            }

            // Undo (Ctrl+Z / Cmd+Z)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                undo();
                return;
            }

            // Redo (Ctrl+Y / Cmd+Y / Cmd+Shift+Z)
            if (
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
            ) {
                redo();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, isPaused, isWon, handleNumberInput, toggleNotesModeArg, togglePause, undo, redo]);

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
        setIsPaused,
        notes,
        isNotesMode,

        toggleNotesMode: toggleNotesModeArg,
        hintsRemaining,
        autoRemoveNotes,
        setAutoRemoveNotes,
        showHighlights,
        setShowHighlights,
        maxHints,
        setMaxHints,
        undo,
        redo,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        animatingGroups
    };
}
