import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import styles from './RegisterSuccess.module.css'

export default function RegisterSuccess() {
  const [searchParams] = useSearchParams()
  const regId = searchParams.get('reg_id')
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className={styles.page}>
      {confetti && (
        <div className={styles.confetti}>
          {[...Array(30)].map((_, i) => (
            <div key={i} className={styles.confettiPiece} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              background: ['#e85d14', '#1a3399', '#4ade80', '#fbbf24', '#a78bfa'][Math.floor(Math.random() * 5)],
            }} />
          ))}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <div className={styles.icon}>✅</div>
        </div>
        <h1>You're Registered!</h1>
        <p className={styles.sub}>
          Your payment was successful and your spot is confirmed.
          A confirmation email is on its way to you.
        </p>
        {regId && (
          <div className={styles.confId}>
            <span>Confirmation ID</span>
            <strong>REG-{regId}</strong>
          </div>
        )}
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span>📅</span>
            <div>
              <strong>April 15, 2026</strong>
              <span>9:00 AM – 6:00 PM</span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <span>📍</span>
            <div>
              <strong>Chicago Convention Center</strong>
              <span>Chicago, IL</span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>Back to Home</Link>
          <Link to="/contact" className={styles.btnSecondary}>Contact Us</Link>
        </div>
      </div>
    </main>
  )
}
