import { Link } from 'react-router-dom'
import styles from './RegisterCancel.module.css'

export default function RegisterCancel() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>↩️</div>
        <h1>Payment Cancelled</h1>
        <p>No worries — your registration was not completed and you have not been charged.</p>
        <p className={styles.sub}>Your information has been saved. You can return and complete your registration whenever you're ready.</p>
        <div className={styles.actions}>
          <Link to="/register" className={styles.btnPrimary}>Try Again</Link>
          <Link to="/contact" className={styles.btnSecondary}>Contact Us</Link>
        </div>
      </div>
    </main>
  )
}
