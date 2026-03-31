import { useState } from 'react'
import { submitRegistration } from '../api/register'
import styles from './Register.module.css'

const ticketTypes = [
  { id: 'general', label: 'General Admission', price: 49 },
  { id: 'vip', label: 'VIP Pass', price: 129 },
  { id: 'virtual', label: 'Virtual Access', price: 0 },
]

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    organization: '', ticketType: 'general', dietary: '', notes: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const selectedTicket = ticketTypes.find(t => t.id === form.ticketType)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitRegistration(form)
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2>You're Registered!</h2>
          <p>A confirmation email has been sent to <strong>{form.email}</strong>.</p>
          <p className={styles.successSub}>
            Ticket: {selectedTicket?.label}
            {selectedTicket?.price > 0 ? ` — $${selectedTicket.price}` : ' — Free'}
          </p>
          <button className="btn btn-primary" onClick={() => setStatus('idle')}>
            Register Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        {/* LEFT: Event info */}
        <div className={styles.eventInfo}>
          <span className="section-label">Upcoming Event</span>
          <h1>Annual Tech Summit 2026</h1>
          <div className={styles.metaList}>
            <div className={styles.metaItem}><span>📅</span> April 15, 2026 · 9:00 AM – 6:00 PM</div>
            <div className={styles.metaItem}><span>📍</span> Chicago Convention Center, IL</div>
            <div className={styles.metaItem}><span>👥</span> 500 Attendees Expected</div>
          </div>
          <p className={styles.eventDesc}>
            Join industry leaders, innovators, and technologists for a full day of keynotes,
            workshops, and networking. This is the Midwest's premier tech event of the year.
          </p>

          {/* Ticket types */}
          <div className={styles.ticketList}>
            <h3>Ticket Types</h3>
            {ticketTypes.map(t => (
              <div key={t.id} className={`${styles.ticketOption} ${form.ticketType === t.id ? styles.ticketSelected : ''}`}
                onClick={() => setForm(p => ({ ...p, ticketType: t.id }))}>
                <div>
                  <div className={styles.ticketName}>{t.label}</div>
                </div>
                <div className={styles.ticketPrice}>
                  {t.price === 0 ? 'Free' : `$${t.price}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className={styles.formWrap}>
          <div className={styles.formCard}>
            <h2>Complete Registration</h2>
            <p className={styles.formSub}>Fill in your details below to secure your spot.</p>

            {status === 'error' && (
              <div className={styles.errorBanner}>⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Sarah" required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Johnson" required />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="sarah@company.com" required />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (312) 555-0100" />
              </div>

              <div className="form-group">
                <label>Organization / Company</label>
                <input name="organization" value={form.organization} onChange={handleChange} placeholder="Acme Corp" />
              </div>

              <div className="form-group">
                <label>Ticket Type *</label>
                <select name="ticketType" value={form.ticketType} onChange={handleChange} required>
                  {ticketTypes.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.label} {t.price > 0 ? `— $${t.price}` : '— Free'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dietary Requirements</label>
                <select name="dietary" value={form.dietary} onChange={handleChange}>
                  <option value="">None</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="halal">Halal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Accessibility needs, questions, etc." rows={3}
                  style={{ resize: 'vertical' }} />
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>{selectedTicket?.label}</span>
                  <strong>{selectedTicket?.price === 0 ? 'Free' : `$${selectedTicket?.price}`}</strong>
                </div>
                {selectedTicket?.price > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Processing Fee</span>
                    <strong>$2.99</strong>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <strong>
                    {selectedTicket?.price === 0
                      ? 'Free'
                      : `$${(selectedTicket?.price || 0) + 2.99}`}
                  </strong>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                {status === 'loading' ? 'Processing…' : (
                  <>
                    {selectedTicket?.price === 0 ? 'Reserve My Spot' : 'Proceed to Payment'}
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              <p className={styles.secureNote}>🔒 Secure checkout · SSL encrypted · No hidden fees</p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
