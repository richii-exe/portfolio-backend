import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState({ loading: false, success: null, error: null })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: null, error: null })

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setStatus({ loading: false, success: 'Message sent!', error: null })
                setFormData({ name: '', email: '', message: '' })
            } else {
                throw new Error('Failed to send message.')
            }
        } catch (error) {
            setStatus({ loading: false, success: null, error: 'Failed. Try again.' })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-colors"
            />
            <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-colors"
            />
            <textarea
                placeholder="Message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-colors"
            />
            <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3 bg-blue-600 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50 transition-all"
            >
                {status.loading ? '...' : 'Send Message'}
            </button>
            {status.success && <p className="text-green-500 text-xs text-center">{status.success}</p>}
            {status.error && <p className="text-red-500 text-xs text-center">{status.error}</p>}
        </form>
    )
}

const Contact = () => {
    return (
        <section className="min-h-[50vh] w-full flex items-center justify-center px-4 sm:px-6 relative z-10 py-20 pb-32 md:pb-40">
            <motion.div
                className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-10 md:p-16 rounded-2xl relative overflow-hidden text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-8 md:mb-12 uppercase tracking-tighter">
                    Let's <span className="text-blue-500">Connect</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                    <div className="space-y-6">
                        <h3 className="text-xl font-heading text-gray-400 uppercase tracking-widest">Inquiries</h3>
                        <p className="text-lg text-gray-300">Available for projects, collaborations, and full-time creative roles.</p>

                        <div className="space-y-4 pt-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-blue-500 uppercase tracking-widest mb-1">Call Me</span>
                                <a href="tel:7845542221" className="text-xl md:text-2xl font-bold hover:text-blue-400 transition-colors">7845542221</a>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-blue-500 uppercase tracking-widest mb-1">Email</span>
                                <a href="mailto:richardson240806@gmail.com" className="text-base sm:text-lg md:text-2xl font-bold hover:text-blue-400 transition-colors break-all">richardson240806@gmail.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <ContactForm />
                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                            <span className="text-gray-500 text-sm tracking-widest uppercase hover:text-blue-500 cursor-pointer transition-colors">Instagram</span>
                            <span className="text-gray-500 text-sm tracking-widest uppercase hover:text-blue-500 cursor-pointer transition-colors">LinkedIn</span>
                            <span className="text-gray-500 text-sm tracking-widest uppercase hover:text-blue-500 cursor-pointer transition-colors">Twitter</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Contact
