
import React, { useEffect, useState } from 'react';

const StatusMessage = ({ message, type }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, type]);

    if (!message) return null;

    let baseClasses = "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md md:w-auto px-6 py-3 rounded-full shadow-xl font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-2";
    let colorClass = 'bg-slate-800 text-white';
    let icon = null;

    if (type === 'success') {
        colorClass = 'bg-emerald-500 text-white';
        icon = (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        );
    } else if (type === 'error') {
        colorClass = 'bg-rose-500 text-white';
        icon = (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        );
    } else {
        // Info
        icon = (
            <svg className="w-5 h-5 opacity-80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        );
    }

    return (
        <div
            id="status-message-display"
            className={`${baseClasses} ${colorClass} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
            {icon}
            <span>{message}</span>
        </div>
    );
};

export default StatusMessage;
