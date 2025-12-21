
import React from 'react';

const Header = () => {
    return (
        <header className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-3 tracking-tight">
                Killer Sudoku
            </h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                Fill the grid so every row, column, and 3x3 box contains 1-9.
                <br />
                <span className="text-primary font-semibold">Cage Strategy:</span> Numbers in dashed cages must sum to the corner value.
            </p>
        </header>
    );
};

export default Header;
