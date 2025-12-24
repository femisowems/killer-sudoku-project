import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function InstallPWA() {
    const { canInstall, promptInstall } = usePWAInstall();

    if (!canInstall) {
        return null;
    }

    return (
        <button
            onClick={promptInstall}
            className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all animate-fade-in-up"
            style={{ backgroundColor: 'var(--primary-color)' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Install App
        </button>
    );
}
