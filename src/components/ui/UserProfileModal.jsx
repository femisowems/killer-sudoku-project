
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

const UserProfileModal = ({ isOpen, onClose }) => {
    const { username, setUsername, stats, resetStats, joinDate, lastActive } = useGame();
    const { user, signIn, signUp, signOut, resetPassword } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [tempUsername, setTempUsername] = useState(username);

    // Auth State
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState(null);

    useEffect(() => {
        setTempUsername(username);
    }, [username]);

    const handleSaveUsername = () => {
        if (tempUsername.trim()) {
            setUsername(tempUsername.trim());
            setIsEditing(false);
        }
    };

    const handleResetStats = () => {
        if (window.confirm("Are you sure you want to reset all your game statistics? This cannot be undone.")) {
            resetStats();
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError(null);
        setAuthMessage(null);
        setAuthLoading(true);

        try {
            if (authMode === 'signup') {
                const { data, error } = await signUp(email, password);
                if (error) throw error;
                if (data.user && !data.session) {
                    setAuthMessage("Registration successful! Please check your email to confirm.");
                }
            } else if (authMode === 'login') {
                const { error } = await signIn(email, password);
                if (error) throw error;
                // Login successful, modal stays open showing profile
            } else if (authMode === 'forgot-password') {
                const { error } = await resetPassword(email);
                if (error) throw error;
                setAuthMessage("Password reset email sent! Check your inbox.");
            }
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    // Helper to calculate aggregate stats
    const getLevelStats = (level) => {
        const s = stats[level] || { started: 0, wins: [] };
        const wins = s.wins.length;
        const totalTime = s.wins.reduce((a, b) => a + b, 0);
        const best = wins > 0 ? Math.min(...s.wins) : null;
        const avg = wins > 0 ? Math.floor(totalTime / wins) : null;
        return {
            level: level.charAt(0).toUpperCase() + level.slice(1),
            played: s.started,
            wins,
            winRate: s.started > 0 ? Math.round((wins / s.started) * 100) : 0,
            best: best !== null ? formatTime(best) : '--',
            avg: avg !== null ? formatTime(avg) : '--',
            totalTimeSeconds: totalTime
        };
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatHours = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h === 0) return `${m}m`;
        return `${h}h ${m}m`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const levels = ['easy', 'medium', 'hard', 'expert'];
    const levelStats = levels.map(getLevelStats);

    const totalGames = levelStats.reduce((acc, cur) => acc + cur.played, 0);
    const totalWins = levelStats.reduce((acc, cur) => acc + cur.wins, 0);
    const totalPlayTime = levelStats.reduce((acc, cur) => acc + cur.totalTimeSeconds, 0);
    const globalWinRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop (Solid background for fullscreen) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 backdrop-blur-md"
                        style={{ backgroundColor: 'var(--bg-app)' }}
                    />

                    {/* Modal Content - Fullscreen */}
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative w-full h-full p-6 sm:p-10 overflow-hidden overflow-y-auto"
                        style={{
                            backgroundColor: 'var(--bg-panel)',
                            color: 'var(--text-base)',
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-title"
                    >
                        <div className="relative z-10 w-full h-full flex flex-col">
                            {!user ? (
                                // --- AUTH UI (Centered) ---
                                <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 id="profile-title" className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-base)' }}>
                                            {user ? 'Profile' : 'Account'}
                                        </h2>
                                        <button onClick={onClose} className="p-2 rounded-full hover:brightness-90 transition-all" style={{ backgroundColor: 'var(--bg-app)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-base)' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <motion.div
                                        key="auth-container"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        layout
                                        className="flex flex-col gap-4 overflow-hidden"
                                    >
                                        {/* Tabs */}
                                        {authMode !== 'forgot-password' ? (
                                            <div className="flex p-1.5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                                                <button
                                                    onClick={() => setAuthMode('login')}
                                                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${authMode === 'login' ? 'shadow-lg' : 'hover:opacity-75'}`}
                                                    style={{
                                                        backgroundColor: authMode === 'login' ? 'var(--primary-accent)' : 'transparent',
                                                        color: authMode === 'login' ? '#ffffff' : 'var(--text-muted)'
                                                    }}
                                                >
                                                    Sign In
                                                </button>
                                                <button
                                                    onClick={() => setAuthMode('signup')}
                                                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${authMode === 'signup' ? 'shadow-lg' : 'hover:opacity-75'}`}
                                                    style={{
                                                        backgroundColor: authMode === 'signup' ? 'var(--primary-accent)' : 'transparent',
                                                        color: authMode === 'signup' ? '#ffffff' : 'var(--text-muted)'
                                                    }}
                                                >
                                                    Register
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-2">
                                                <button onClick={() => setAuthMode('login')} className="p-1 rounded-full hover:brightness-90" style={{ backgroundColor: 'var(--bg-app)' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--text-base)' }}>
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <h3 className="text-lg font-bold" style={{ color: 'var(--text-base)' }}>Reset Password</h3>
                                            </div>
                                        )}

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={authMode}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {authError && (
                                                    <div className="p-3 mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
                                                        {authError}
                                                    </div>
                                                )}
                                                {authMessage && (
                                                    <div className="p-3 mb-4 text-xs bg-green-500/10 border border-green-500/20 text-green-200 rounded-lg">
                                                        {authMessage}
                                                    </div>
                                                )}

                                                <form onSubmit={handleAuth} className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <input
                                                                type="email"
                                                                required
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3.5 rounded-xl border outline-none focus:ring-2 focus:brightness-110 transition-all"
                                                                style={{
                                                                    backgroundColor: 'var(--bg-app)',
                                                                    borderColor: 'var(--border-thin)',
                                                                    color: 'var(--text-base)',
                                                                    '--tw-ring-color': 'var(--primary-accent)'
                                                                }}
                                                                placeholder="you@example.com"
                                                            />
                                                        </div>
                                                    </div>
                                                    {authMode !== 'forgot-password' && (
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Password</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                    </svg>
                                                                </div>
                                                                <input
                                                                    type={showPassword ? "text" : "password"}
                                                                    required={authMode !== 'forgot-password'}
                                                                    minLength={6}
                                                                    value={password}
                                                                    onChange={(e) => setPassword(e.target.value)}
                                                                    className="w-full pl-10 pr-12 py-3.5 rounded-xl border outline-none focus:ring-2 focus:brightness-110 transition-all"
                                                                    style={{
                                                                        backgroundColor: 'var(--bg-app)',
                                                                        borderColor: 'var(--border-thin)',
                                                                        color: 'var(--text-base)',
                                                                        '--tw-ring-color': 'var(--primary-accent)'
                                                                    }}
                                                                    placeholder="••••••••"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-75 outline-none transition-colors"
                                                                    style={{ color: 'var(--text-muted)' }}
                                                                >
                                                                    {showPassword ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {authMode === 'login' && (
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => setAuthMode('forgot-password')}
                                                                className="text-xs font-bold hover:brightness-110 transition-colors"
                                                                style={{ color: 'var(--primary-accent)' }}
                                                            >
                                                                Forgot Password?
                                                            </button>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={authLoading}
                                                        className="w-full py-4 text-white font-bold rounded-xl shadow-xl transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                                        style={{ backgroundColor: 'var(--primary-accent)' }}
                                                    >
                                                        {authLoading && (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        )}
                                                        {authMode === 'login' ? 'Sign In' : (authMode === 'signup' ? 'Create Account' : 'Send Reset Link')}
                                                    </button>
                                                </form>
                                                <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                                    {authMode === 'signup' ? 'Sign up to sync your stats across devices.' : (authMode === 'forgot-password' ? 'We will send you a link to reset it.' : 'Welcome back!')}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            ) : (
                                // --- PROFILE UI (Split View) ---
                                <motion.div
                                    key="profile-container"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                    className="flex w-full h-full md:h-auto md:max-h-[85vh] md:max-w-5xl md:mx-auto md:my-auto flex-col md:flex-row shadow-2xl rounded-none md:rounded-3xl overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--bg-panel-alt)',
                                    }}
                                >
                                    {/* Left Panel: User Info */}
                                    <div className="w-full md:w-5/12 lg:w-4/12 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r gap-8" style={{ borderColor: 'var(--border-thin)' }}>
                                        <div className="flex flex-col items-center w-full">
                                            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl text-white font-bold text-4xl transform hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--primary-accent)' }}>
                                                {username.charAt(0).toUpperCase()}
                                            </div>

                                            {isEditing ? (
                                                <div className="flex items-center gap-2 mb-2 w-full justify-center">
                                                    <input
                                                        type="text"
                                                        value={tempUsername}
                                                        onChange={(e) => setTempUsername(e.target.value)}
                                                        className="w-full max-w-[200px] px-3 py-1 rounded border text-center font-bold outline-none focus:ring-2"
                                                        style={{
                                                            backgroundColor: 'var(--bg-app)',
                                                            borderColor: 'var(--border-thin)',
                                                            color: 'var(--text-base)',
                                                            '--tw-ring-color': 'var(--primary-accent)'
                                                        }}
                                                        autoFocus
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                                    />
                                                    <button onClick={handleSaveUsername} className="text-green-500 hover:text-green-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group cursor-pointer mb-2 justify-center" onClick={() => { setTempUsername(username); setIsEditing(true); }}>
                                                    <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-base)' }}>{username}</h3>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="text-xs font-medium px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)', color: 'var(--text-muted)' }}>
                                                {user.email}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div className="p-4 rounded-2xl flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)' }}>
                                                <span className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Games</span>
                                                <span className="text-2xl font-black" style={{ color: 'var(--text-base)' }}>{totalGames}</span>
                                            </div>
                                            <div className="p-4 rounded-2xl flex flex-col items-center" style={{ backgroundColor: 'var(--bg-app)' }}>
                                                <span className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Wins</span>
                                                <span className="text-2xl font-black" style={{ color: 'var(--primary-accent)' }}>{totalWins}</span>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3">
                                            <button
                                                onClick={onClose}
                                                className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all hover:brightness-110 active:scale-[0.95]"
                                                style={{ backgroundColor: 'var(--primary-accent)' }}
                                            >
                                                Done
                                            </button>
                                            <button
                                                onClick={signOut}
                                                className="w-full py-3 text-sm font-bold rounded-xl transition-colors hover:brightness-95"
                                                style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-base)' }}
                                            >
                                                Sign Out
                                            </button>
                                            <button
                                                onClick={handleResetStats}
                                                className="w-full py-3 text-sm font-bold rounded-xl transition-colors hover:bg-red-500/10 text-red-500"
                                            >
                                                Reset Stats
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Panel: Detailed Stats */}
                                    <div className="w-full md:w-7/12 lg:w-8/12 p-8 overflow-y-auto" style={{ backgroundColor: 'var(--bg-panel)' }}>
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xl font-bold" style={{ color: 'var(--text-base)' }}>Performance</h4>
                                            <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-thin)' }}>
                                                Win Rate: {globalWinRate}%
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                                            {levelStats.map((stat) => (
                                                <div key={stat.level} className="p-5 rounded-2xl border transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <p className="font-bold text-lg" style={{ color: 'var(--text-base)' }}>{stat.level}</p>
                                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.played} Started</p>
                                                        </div>
                                                        <div className={`w-3 h-3 rounded-full ${stat.level === 'Easy' ? 'bg-green-400' :
                                                            stat.level === 'Medium' ? 'bg-yellow-400' :
                                                                stat.level === 'Hard' ? 'bg-orange-400' :
                                                                    'bg-red-500'
                                                            }`}></div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Best Time</p>
                                                            <p className="font-mono font-bold text-base" style={{ color: 'var(--text-base)' }}>{stat.best}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Win Rate</p>
                                                            <p className="font-bold text-base" style={{ color: stat.winRate > 50 ? 'var(--primary-accent)' : 'var(--text-base)' }}>{stat.winRate}%</p>
                                                        </div>
                                                        <div className="col-span-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] items-center flex gap-1" style={{ color: 'var(--text-muted)' }}>
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    Avg Time
                                                                </span>
                                                                <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-base)' }}>{stat.avg}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-6 rounded-2xl border mb-6" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-thin)' }}>
                                            <h5 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Account Activity</h5>
                                            <div className="flex justify-around text-center">
                                                <div>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Joined</p>
                                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-base)' }}>{formatDate(joinDate)}</p>
                                                </div>
                                                <div className="w-px bg-current opacity-10"></div>
                                                <div>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Play Time</p>
                                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-base)' }}>{formatHours(totalPlayTime)}</p>
                                                </div>
                                                <div className="w-px bg-current opacity-10"></div>
                                                <div>
                                                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Last Active</p>
                                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-base)' }}>{formatDate(lastActive)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Decorative Blobs */}
                        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--primary-accent)' }}></div>
                        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--primary-accent)' }}></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UserProfileModal;
