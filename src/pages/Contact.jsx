import { useState } from 'react'
import { submitContact } from '../api/contact'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: '',
    estimatedParticipants: '', programMonth: '', programYear: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitContact(form)
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.')
      setStatus('error')
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i)

  return (
    <main className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={styles.sectionLabel}>Get In Touch</span>
          <h1>We'd Love to Hear From You</h1>
          <p className={styles.headerSub}>
            Have questions about Registration123? Our team typically responds within 2 business hours.
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Info */}
        <div className={styles.infoCol}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📞</div>
            <h3>Sales & Onboarding</h3>
            <p>Ready to get started? Talk to our team about your event needs.</p>
            <a href="mailto:sales@registration123.com">sales@registration123.com</a>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🛠️</div>
            <h3>Technical Support</h3>
            <p>Having issues? Our support engineers are standing by to help.</p>
            <a href="mailto:support@registration123.com">support@registration123.com</a>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🏢</div>
            <h3>Office</h3>
            <p>
              1932 S. Halsted St., Suite 413<br />
              Chicago, IL 60608<br />
              +1 (877) 309-1565
            </p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formWrap}>
          {status === 'success' ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✉️</div>
              <h2>Message Sent!</h2>
              <p>Thanks for reaching out. We'll get back to you within 2 business hours.</p>
              <button className={`btn btn-primary ${styles.resetBtn}`} onClick={() => {
                setStatus('idle')
                setForm({ name: '', email: '', subject: '', message: '', estimatedParticipants: '', programMonth: '', programYear: '' })
              }}>
                Send Another
              </button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <h2>Send a Message</h2>

              {status === 'error' && (
                <div className={styles.errorBanner}>⚠️ {error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Sarah Johnson" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="sarah@company.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a topic…</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="demo">Request a Demo</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Number of Participants</label>
                  <select name="estimatedParticipants" value={form.estimatedParticipants} onChange={handleChange}>
                    <option value="">Select a range…</option>
                    <option value="1-50">1 – 50</option>
                    <option value="51-100">51 – 100</option>
                    <option value="101-250">101 – 250</option>
                    <option value="251-500">251 – 500</option>
                    <option value="501-1000">501 – 1,000</option>
                    <option value="1001-2500">1,001 – 2,500</option>
                    <option value="2500+">2,500+</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Program Month</label>
                    <select name="programMonth" value={form.programMonth} onChange={handleChange}>
                      <option value="">Select month…</option>
                      {months.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Program Year</label>
                    <select name="programYear" value={form.programYear} onChange={handleChange}>
                      <option value="">Select year…</option>
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help…" rows={5} required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
