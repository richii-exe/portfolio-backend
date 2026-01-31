import React from 'react'

const ThemeToggle = ({ theme, toggleTheme }) => {
    const isDark = theme === 'dark'

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <div className="group relative">
                <button
                    onClick={toggleTheme}
                    className={`
                        w-12 h-12 rounded-full flex items-center justify-center 
                        border backdrop-blur-md transition-all duration-300 shadow-lg
                        ${isDark
                            ? 'bg-gray-900/40 border-gray-700/50 text-yellow-400 hover:bg-gray-800/60 hover:shadow-yellow-400/20'
                            : 'bg-white/80 border-gray-200/50 text-orange-500 hover:bg-white hover:shadow-orange-500/20'
                        }
                    `}
                    aria-label="Toggle Theme"
                >
                    {isDark ? (
                        // Moon Icon (Indicates we are in Dark Mode or Switch to Light? Usually icon shows current state or target. 
                        // Let's show Sun if we want to switch to Day, or Moon if we are in Night? 
                        // Standard: Show the icon of the mode we are IN or the mode we switch TO?
                        // Let's show the "Target" usually or the "Current Status".
                        // Let's show Sun icon implies "Click for Day", Moon implies "Click for Night".
                        // But wait, if I am in Dark mode, I want to go to Light mode. So Sun.
                        // If I am in Light mode, I want to go to Dark mode. So Moon.
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    ) : (
                        // Moon Icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    )}
                </button>

                {/* Tooltip */}
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                </span>
            </div>
        </div>
    )
}

export default ThemeToggle
