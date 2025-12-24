import { useRef, useEffect, useCallback } from 'react';

export const useWorker = () => {
    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/puzzle.worker.js', import.meta.url), { type: 'module' });

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const validateBoard = useCallback((board) => {
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'validate',
                payload: { board }
            });
        }
    }, []);

    return {
        workerRef,
        validateBoard
    };
};
