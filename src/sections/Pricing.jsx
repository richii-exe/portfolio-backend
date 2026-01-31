import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Pricing = () => {
    const [currency, setCurrency] = useState('USD')
    const [activeCategory, setActiveCategory] = useState('video') // 'video' or 'web'
    const [selectedPlan, setSelectedPlan] = useState(null)

    const categories = {
        video: [
            {
                name: 'Basic Edit',
                usd: 49,
                inr: 499,
                features: ['4K Color Correction', 'Standard Cuts', '2 Revisions', '3 Day Delivery']
            },
            {
                name: 'Cinematic Pro',
                usd: 129,
                inr: 899,
                features: ['Advanced Grading', 'Sound Design', '5 Revisions', 'Priority Queue', 'Social Formats']
            },
            {
                name: 'Elite Narrative',
                usd: 299,
                inr: 2499,
                features: ['Creative Direction', 'Unlimited Revisions', 'Full Score', 'Raw Project Files', '1-on-1 Strategy']
            }
        ],
        web: [
            {
                name: 'Landing Page',
                usd: 89,
                inr: 799,
                features: ['Single Page React', 'Responsive Design', 'SEO Ready', 'Source Code Only']
            },
            {
                name: 'Brand Portfolio',
                usd: 199,
                inr: 999,
                features: ['Multi-page Site', '3D Interactions', 'Hosting Setup', 'Framer Motion FX']
            },
            {
                name: 'Full Studio Prep',
                usd: 499,
                inr: 4999,
                features: ['Custom CMS', 'Advanced WebGL', 'Priority Support', 'Full Brand Identity']
            }
        ]
    }

    const currentPlans = categories[activeCategory]

    return (
        <section className="w-full py-20 px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col space-y-12 mb-20">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
                        <div>
                            <h2 className="text-4xl md:text-7xl font-bold font-heading uppercase tracking-tighter text-glow">
                                Investment <span className="text-blue-500">Plans</span>
                            </h2>
                            <p className="text-gray-400 mt-4 uppercase tracking-[0.5em] text-[10px] font-bold">Transparent pricing for elite creators.</p>
                        </div>

                        {/* Currency Toggle */}
                        <div className="flex bg-white/5 border border-white/10 p-1 rounded-full backdrop-blur-sm shadow-xl">
                            <button
                                onClick={() => setCurrency('USD')}
                                className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all ${currency === 'USD' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:text-white'}`}
                            >
                                USD ($)
                            </button>
                            <button
                                onClick={() => setCurrency('INR')}
                                className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all ${currency === 'INR' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:text-white'}`}
                            >
                                INR (₹)
                            </button>
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setActiveCategory('video')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${activeCategory === 'video' ? 'bg-blue-600/10 border-blue-500 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Video Editing</span>
                        </button>
                        <button
                            onClick={() => setActiveCategory('web')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${activeCategory === 'web' ? 'bg-blue-600/10 border-blue-500 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Web Design</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatePresence mode="wait">
                        {currentPlans.map((plan, i) => (
                            <motion.div
                                key={`${activeCategory}-${plan.name}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className={`relative glass-panel p-10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all flex flex-col`}
                            >
                                {i === 1 && <div className="absolute top-0 right-0 bg-blue-600 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-bl-3xl shadow-lg z-20">Premium</div>}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold font-heading mb-2 tracking-tight">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl md:text-5xl font-bold tracking-tighter">
                                            {currency === 'USD' ? `$${plan.usd}` : `₹${plan.inr}`}
                                        </span>
                                        <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">/ flat</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map(f => (
                                        <li key={f} className="text-sm text-gray-400 flex items-center">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => setSelectedPlan(plan)}
                                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 hover:border-blue-500 transition-all shadow-xl mt-auto"
                                >
                                    Select Project
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Checkout Modal / Bank Details */}
                <AnimatePresence>
                    {selectedPlan && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-xl glass-panel p-1 border-white/20 rounded-[3rem] shadow-2xl relative"
                            >
                                <div className="bg-black/90 p-10 md:p-14 rounded-[2.8rem] space-y-10 relative overflow-hidden">
                                    {/* Glow Effect */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

                                    <button
                                        onClick={() => setSelectedPlan(null)}
                                        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>

                                    <div className="text-center">
                                        <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Finalizing Investment</p>
                                        <h2 className="text-4xl font-bold font-heading tracking-tight">{selectedPlan.name}</h2>
                                        <div className="text-xl text-white/50 mt-2 font-light">
                                            {currency === 'USD' ? `$${selectedPlan.usd}` : `₹${selectedPlan.inr}`} Total
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Bank Details Area */}
                                        <div className="space-y-4">
                                            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Transfer To</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">Bank Name</span>
                                                        <span className="font-bold text-white uppercase tracking-wider">HSBC Global</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">Account Name</span>
                                                        <span className="font-bold text-white uppercase tracking-wider">RICHIE EDITORIALS</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">Account Number</span>
                                                        <span className="font-bold text-blue-400 tracking-[0.2em]">0987 6543 2109</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-400">IFSC / SWIFT</span>
                                                        <span className="font-bold text-white tracking-widest">HSBC0000101</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-gray-500 italic text-center px-4">
                                                Please send the screenshot of the transaction to
                                                <span className="text-blue-500 font-bold ml-1">richardson240806@gmail.com</span>
                                                to activate your project slot immediately.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedPlan(null)}
                                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                                        >
                                            Got It
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

export default Pricing
