import React, { useState } from 'react'
import { motion } from 'framer-motion'
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'

const Application = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'Video Editing',
        message: ''
    })
    const [status, setStatus] = useState({ loading: false, success: null, error: null })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: null, error: null })

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setStatus({ loading: false, success: 'Application sent successfully!', error: null })
                setFormData({ name: '', email: '', phone: '', projectType: 'Video Editing', message: '' })
            } else {
                throw new Error('Failed to send application.')
            }
        } catch (error) {
            setStatus({ loading: false, success: null, error: 'Failed to send application. Please try again.' })
        }
    }

    return (
        <section className="w-full py-12 md:py-20 px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-16">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading uppercase mb-4">Work Request</h2>
                    <p className="text-gray-400 text-sm md:text-base">Apply to collaborate on your next cinematic project.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-blue-500 font-bold ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-blue-500 font-bold ml-1">Contact Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="email@example.com"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-blue-500 font-bold ml-1">Phone Number</label>
                            <PhoneInput
                                country={'us'}
                                value={formData.phone}
                                onChange={phone => setFormData({ ...formData, phone })}
                                inputStyle={{
                                    width: '100%',
                                    height: '56px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    paddingLeft: '48px'
                                }}
                                buttonStyle={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.75rem 0 0 0.75rem',
                                    borderRight: 'none'
                                }}
                                dropdownStyle={{
                                    backgroundColor: '#1a1a1a',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-blue-500 font-bold ml-1">Project Type</label>
                        <select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option>Video Editing</option>
                            <option>Web Design</option>
                            <option>Full Creative Direction</option>
                            <option>Cinematic Commercial</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-blue-500 font-bold ml-1">Vision / Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Tell me about your project goals..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status.loading ? 'Sending...' : 'Submit Application'}
                    </button>

                    {status.success && <p className="text-green-500 text-center font-bold">{status.success}</p>}
                    {status.error && <p className="text-red-500 text-center font-bold">{status.error}</p>}
                </form>
            </div>
        </section>
    )
}

export default Application
