import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { COMPANY, WHATSAPP_URL, CALL_URL } from '../data/constants'
import { api } from '../api'
import FadeUp from '../components/ui/FadeUp'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.submitContact(form)
      const msg = `Name: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0ASubject: ${form.subject}%0AMessage: ${form.message}`
      window.open(`https://wa.me/${COMPANY.whatsapp}?text=Contact Inquiry:%0A${msg}`, '_blank')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Message failed. Please try again or call us directly.')
    } finally {
      setSending(false)
    }
  }

  const inputClass = "w-full bg-[#FAFAF8] border border-[#E5E5E5] text-[#222222] text-sm rounded-2xl px-4 py-3 placeholder-[#888888] focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 font-body"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Get in Touch</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              Contact <span className="text-[#B5121B]">Us</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              We're here 24/7. Reach out via call, WhatsApp, email, or visit our office in Bangalore.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left: Contact Info */}
            <div className="space-y-5">
              {/* Phone */}
              <FadeUp delay={0.05}>
                <div className="bg-[#FAFAF8] rounded-3xl p-6 border border-[#E5E5E5] shadow-card hover:border-brand-300 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center mb-4">
                    <Phone size={20} className="text-brand-600" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#171717] mb-2">Call Us Directly</h3>
                  <div className="space-y-1">
                    {COMPANY.phones.map(p => (
                      <p key={p}>
                        <a href={`tel:+91${p}`} className="text-brand-600 font-bold hover:underline text-sm sm:text-base">
                          +91 {p}
                        </a>
                      </p>
                    ))}
                  </div>
                  <a
                    href={CALL_URL}
                    className="inline-block mt-4 text-xs font-button font-bold text-brand-600 bg-white border border-[#E5E5E5] px-4 py-2 rounded-full hover:bg-brand-50 transition-colors shadow-sm"
                  >
                    Call Now →
                  </a>
                </div>
              </FadeUp>

              {/* WhatsApp */}
              <FadeUp delay={0.1}>
                <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-200/80 shadow-card hover:border-emerald-400 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-4">
                    <MessageCircle size={20} className="text-emerald-700" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#171717] mb-1">WhatsApp Chat</h3>
                  <p className="text-emerald-800 text-xs mb-3 font-medium">Instant replies · Usually in 2 mins</p>
                  <p className="text-emerald-800 text-sm font-bold mb-4">+91 {COMPANY.whatsapp}</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-button font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-full transition-colors shadow-sm"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </FadeUp>

              {/* Email & Office */}
              <FadeUp delay={0.15}>
                <div className="bg-[#FAFAF8] rounded-3xl p-6 border border-[#E5E5E5] shadow-card hover:border-brand-300 transition-all duration-300 space-y-4">
                  <div>
                    <div className="flex items-center gap-2.5 text-[#171717] font-heading font-bold text-sm mb-1">
                      <Mail size={16} className="text-brand-600" />Email
                    </div>
                    <a href={`mailto:${COMPANY.email}`} className="text-brand-600 text-xs sm:text-sm hover:underline font-medium">
                      {COMPANY.email}
                    </a>
                  </div>
                  <div className="border-t border-[#EAEAEA] pt-4">
                    <div className="flex items-center gap-2.5 text-[#171717] font-heading font-bold text-sm mb-1">
                      <MapPin size={16} className="text-brand-600" />Office Address
                    </div>
                    <p className="text-[#555555] text-xs leading-relaxed font-light">
                      {COMPANY.address.line1}<br />{COMPANY.address.line2}<br />{COMPANY.address.city}
                    </p>
                  </div>
                  <div className="border-t border-[#EAEAEA] pt-4">
                    <div className="flex items-center gap-2.5 text-[#171717] font-heading font-bold text-sm mb-1">
                      <Clock size={16} className="text-brand-600" />Operating Hours
                    </div>
                    <p className="text-[#555555] text-xs font-light">{COMPANY.hours}</p>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Right: Contact Form (2 columns) */}
            <div className="lg:col-span-2">
              <FadeUp delay={0.1}>
                <div className="bg-[#FAFAF8] rounded-3xl p-8 sm:p-10 border border-[#E5E5E5] shadow-card relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Send Us a Message</h2>
                  <p className="text-[#666666] text-sm mb-8 font-light">Fill the form and we'll reply within 30 minutes.</p>

                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-emerald-600" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-[#171717] mb-2">Message Sent!</h3>
                      <p className="text-[#555555] text-sm max-w-sm mx-auto mb-6 font-light">
                        We have received your message and our team will get back to you shortly.
                      </p>
                      <button onClick={() => setSubmitted(false)} className="btn-primary text-xs py-3 px-6">
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Full Name *</label>
                            <input className={inputClass} placeholder="Your Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Phone Number *</label>
                            <input className={inputClass} placeholder="10-digit mobile number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Email Address</label>
                            <input type="email" className={inputClass} placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Subject *</label>
                            <input className={inputClass} placeholder="Airport / Outstation / Corporate" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Message / Requirements *</label>
                          <textarea rows={5} className={inputClass} placeholder="Tell us your pickup location, drop location, dates, vehicle preference, or any special requirements..." required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                        </div>

                        <button type="submit" disabled={sending} className="w-full btn-primary text-sm py-4 px-8 shadow-brand mt-2 disabled:opacity-60">
                          <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                            <Send size={16} />{sending ? 'Sending...' : 'Send Message via WhatsApp'}
                          </span>
                        </button>
                      </form>
                      {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                          {error}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="px-4 sm:px-8 lg:px-16 pb-12 sm:pb-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-card">
              {/* Map Header */}
              <div className="bg-[#FAFAF8] px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center shadow-sm">
                    <MapPin size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[#171717] text-sm">Venkat Sai Travels</p>
                    <p className="text-[#666666] text-xs font-light">{COMPANY.address.line1}, {COMPANY.address.city}</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/Venkat+Sai+Travels/@12.999172,77.5505866,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3d8cffffffff:0xfc8b2fcaed393f46!8m2!3d12.999172!4d77.5531615!16s%2Fg%2F1tm283rh?entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-button font-bold text-brand-600 bg-white border border-brand-200 px-4 py-2 rounded-full hover:bg-brand-50 hover:border-brand-400 transition-all duration-200 shadow-sm"
                >
                  <MapPin size={13} />
                  Open in Google Maps →
                </a>
              </div>

              {/* Map Placeholder / Embed area */}
              <a
                href="https://www.google.com/maps/place/Venkat+Sai+Travels/@12.999172,77.5505866,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3d8cffffffff:0xfc8b2fcaed393f46!8m2!3d12.999172!4d77.5531615!16s%2Fg%2F1tm283rh?entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="block relative group"
              >
                {/* Embedded Google Map iframe */}
                <div className="relative w-full h-[340px] sm:h-[420px] bg-[#E8F0E8] overflow-hidden pointer-events-none">
                  <iframe
                    title="Venkat Sai Travels Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6!2d77.5505866!3d12.999172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d8cffffffff%3A0xfc8b2fcaed393f46!2sVenkat%20Sai%20Travels!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>

                {/* Hover overlay with "Click to Open" */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-lg flex items-center gap-2 border border-brand-200">
                    <MapPin size={15} className="text-brand-600" />
                    <span className="text-sm font-button font-bold text-[#171717]">Open in Google Maps</span>
                  </div>
                </div>
              </a>

              {/* Map Footer */}
              <div className="bg-[#FAFAF8] px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#555555] font-medium">
                    <Clock size={13} className="text-brand-600" />
                    <span>{COMPANY.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#555555] font-medium">
                    <Phone size={13} className="text-brand-600" />
                    <a href={CALL_URL} className="hover:text-brand-600 transition-colors">+91 {COMPANY.phones[0]}</a>
                  </div>
                </div>
                <span className="text-[10px] text-[#888888] font-light">Rajajinagar, Bengaluru, Karnataka</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </motion.div>
  )
}
