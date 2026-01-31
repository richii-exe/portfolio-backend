import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_URL || ''

const Works = () => {
    const [reels, setReels] = useState([])
    const [websites, setWebsites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch reels from API
                const reelsRes = await fetch(`${API_BASE}/api/reels`)
                const reelsData = await reelsRes.json()
                if (reelsData.success && reelsData.data.length > 0) {
                    setReels(reelsData.data)
                }

                // Fetch web designs from API
                const webRes = await fetch(`${API_BASE}/api/webdesigns`)
                const webData = await webRes.json()
                if (webData.success && webData.data.length > 0) {
                    setWebsites(webData.data)
                }
            } catch (error) {
                console.log('Error fetching content:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchContent()
    }, [])

    if (loading) {
        return (
            <section className="w-full py-20 px-6 relative z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
                    <div className="text-purple-500 animate-pulse">Loading...</div>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full py-20 px-6 relative z-10">
            <div className="max-w-6xl mx-auto space-y-32">

                {/* Reel Section */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading uppercase tracking-tighter">
                            Video <span className="text-purple-500">Reels</span>
                        </h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-1 bg-purple-600 mt-4 shadow-[0_0_15px_rgba(188,0,255,0.5)]"
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {reels.map((reel, i) => (
                            <motion.div
                                key={reel.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="relative aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden group shadow-2xl shadow-purple-500/0 hover:shadow-purple-500/10 transition-shadow duration-500"
                            >
                                {/* Thumbnail or Video */}
                                {reel.url ? (
                                    reel.mimetype?.startsWith('video') ? (
                                        <video
                                            src={`${API_BASE}${reel.url}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            muted
                                            loop
                                            autoPlay
                                            playsInline
                                            preload="auto"
                                        />
                                    ) : (
                                        <img
                                            src={`${API_BASE}${reel.url}`}
                                            alt={reel.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )
                                ) : null}

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-20 h-20 rounded-full bg-purple-600/30 backdrop-blur-xl border border-purple-500/50 flex items-center justify-center"
                                    >
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                    </motion.div>
                                </div>
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-1">{reel.category}</p>
                                    <h3 className="text-2xl font-bold">{reel.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Web Design Section */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 md:text-right"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading uppercase tracking-tighter">
                            Web <span className="text-emerald-500">Designs</span>
                        </h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-1 bg-emerald-600 mt-4 md:ml-auto shadow-[0_0_15px_rgba(0,255,140,0.5)]"
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                        {websites.map((web, i) => (
                            <motion.div
                                key={web.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2, duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
                                whileHover={{ y: -15, scale: 1.02 }}
                                className="glass-panel group relative overflow-hidden p-2 rounded-[2.5rem] transition-all duration-700 hover:border-emerald-500/30"
                            >
                                <div className="bg-black/80 rounded-[1.5rem] md:rounded-[2.3rem] p-4 sm:p-6 md:p-8 h-full relative z-10 overflow-hidden">
                                    {/* Backlighting bloom inside the card */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="w-full aspect-[16/10] bg-zinc-900 rounded-2xl mb-8 border border-white/5 flex items-center justify-center overflow-hidden relative group-hover:border-emerald-500/30 transition-colors shadow-inner">
                                        {web.url ? (
                                            web.mimetype?.startsWith('video') ? (
                                                <video
                                                    src={`${API_BASE}${web.url}`}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    loop
                                                    onMouseEnter={(e) => e.target.play()}
                                                    onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                                />
                                            ) : (
                                                <img
                                                    src={`${API_BASE}${web.url}`}
                                                    alt={web.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,140,0.05),transparent)] group-hover:scale-150 transition-transform duration-1000" />
                                                <span className="text-white/5 uppercase tracking-[1em] text-[8px] font-bold">System Cache</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.5em]">{web.tech}</p>
                                        <h3 className="text-3xl font-bold font-heading leading-tight tracking-tighter">{web.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="h-[1px] w-8 bg-emerald-500/30" />
                                            <p className="text-gray-500 text-sm italic">{web.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Dynamic Environmental Scan Ray */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
                    <motion.div
                        animate={{ top: ['-20%', '120%'], opacity: [0, 1, 0], backgroundColor: ['#00f0ff', '#bc00ff', '#00ff8c'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[300px] blur-[150px]"
                    />
                </div>
            </div>
        </section>
    )
}

export default Works
