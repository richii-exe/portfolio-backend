import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingControls = ({ isHighPerf, onToggle }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

            {/* Tooltip / Label - appears on hover */}
            <div className="group relative">
                <button
                    onClick={onToggle}
                    className={`
                        w-12 h-12 rounded-full flex items-center justify-center 
                        border backdrop-blur-md transition-all duration-300 shadow-lg
                        ${isHighPerf
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/40 hover:shadow-blue-500/30'
                            : 'bg-gray-800/20 border-gray-600/50 text-gray-400 hover:bg-gray-700/40'
                        }
                    `}
                    aria-label="Toggle Graphics Quality"
                >
                    {isHighPerf ? (
                        /* "High Perf" / 3D Icon or "Eye" */
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    ) : (
                        /* "Low Perf" / Off Icon */
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                        </svg>
                    )}
                </button>

                {/* Tooltip */}
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {isHighPerf ? 'Cinematic Mode: ON' : 'Lite Mode (Faster)'}
                </span>
            </div>
        </div>
    )
}

export default FloatingControls
