
import React from 'react';

const Header = () => {
    return (
        <header className="text-center mb-4 sm:mb-8 animate-fade-in px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2 sm:mb-3 tracking-tight hover:opacity-80 transition-opacity">
                <a href="/">Killer Sudoku</a>
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                Fill the grid so every row, column, and 3x3 box contains 1-9.
                <br />
            </p>
        </header>
    );
};

export default Header;
