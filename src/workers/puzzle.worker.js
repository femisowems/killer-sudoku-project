
import { countSolutions } from '../logic/sudoku-solver';

self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'validate') {
        const { board } = payload;
        const solutions = countSolutions(board);

        self.postMessage({
            type: 'validationResult',
            payload: {
                unique: solutions === 1,
                solutionCount: solutions
            }
        });
    }
};
