import { Link } from 'react-router-dom'
import styles from './WhyUs.module.css'

const differentiators = [
  {
    icon: '🧑‍💼',
    title: 'Real People, Not Just Software',
    desc: 'Every client gets a dedicated registration manager — a real person who knows your event, answers your calls, and is personally accountable for your success. You\'re never just a ticket number.',
  },
  {
    icon: '📅',
    title: '30+ Years of On-the-Ground Experience',
    desc: 'TREX has been managing registrations since 1993. We\'ve seen every scenario, solved every problem, and built systems that actually work on event day — not just in a demo.',
  },
  {
    icon: '🔧',
    title: 'We Handle the Hard Parts',
    desc: 'Cancellations, refunds, special requests, dietary accommodations, group bookings, last-minute changes — our team handles all of it so you don\'t have to.',
  },
  {
    icon: '📐',
    title: 'Built Around Your Event, Not a Template',
    desc: 'We don\'t force your event into a pre-built form. We configure everything — forms, workflows, communications, reports — to match exactly how your organization works.',
  },
  {
    icon: '🏥',
    title: 'Deep Nonprofit & Medical Society Expertise',
    desc: 'Through our long-standing partnership with Medical Society Management, Inc., we have specialized experience with nonprofit medical societies, CME events, and association conferences.',
  },
  {
    icon: '📍',
    title: 'We Show Up on Event Day',
    desc: 'Unlike SaaS platforms that disappear after onboarding, we can be physically present at your event — running check-in, managing walk-ins, and solving problems in real time.',
  },
]

const comparisons = [
  { feature: 'Dedicated registration manager', us: true, saas: false, agency: true },
  { feature: 'Custom form configuration done for you', us: true, saas: false, agency: true },
  { feature: 'Attendee communication handled by our team', us: true, saas: false, agency: false },
  { feature: 'On-site event day staffing', us: true, saas: false, agency: false },
  { feature: 'Financial reconciliation & reporting', us: true, saas: false, agency: false },
  { feature: 'Association management services', us: true, saas: false, agency: false },
  { feature: 'Modern self-service platform available', us: true, saas: true, agency: false },
  { feature: 'Medical society expertise', us: true, saas: false, agency: false },
  { feature: 'Based in Chicago, serving nationwide', us: true, saas: false, agency: false },
]

export default function WhyUs() {
  return (
    <main className={styles.page}>

      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Why Registration123 + TREX</span>
          <h1>The Difference Between<br />a Tool and a Partner</h1>
          <p className={styles.headerSub}>
            Any registration platform can give you a form. We give you a team with 30+ years 
            of experience that handles everything — so your organization can focus on what matters.
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className={styles.diff}>
        <div className={styles.diffInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>What Makes Us Different</span>
            <h2>Why Clients Choose Us<br />and Stay With Us</h2>
            <p className={styles.sectionSub}>Our client retention rate speaks for itself. Here's what keeps organizations coming back year after year.</p>
          </div>
          <div className={styles.diffGrid}>
            {differentiators.map(d => (
              <div key={d.title} className={styles.diffCard}>
                <div className={styles.diffIcon}>{d.icon}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={styles.comparison}>
        <div className={styles.comparisonInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>How We Compare</span>
            <h2>Registration123 + TREX vs. The Alternatives</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className={styles.usCol}>Registration123 + TREX</th>
                  <th>SaaS Platform Only</th>
                  <th>Event Agency</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(c => (
                  <tr key={c.feature}>
                    <td>{c.feature}</td>
                    <td className={styles.usCol}>{c.us ? <span className={styles.yes}>✓</span> : <span className={styles.no}>—</span>}</td>
                    <td>{c.saas ? <span className={styles.yes}>✓</span> : <span className={styles.no}>—</span>}</td>
                    <td>{c.agency ? <span className={styles.yes}>✓</span> : <span className={styles.no}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partnership section */}
      <section className={styles.partnership}>
        <div className={styles.partnershipInner}>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>R<span>123</span></div>
            <h3>Registration123</h3>
            <p>Modern, web-based registration platform launched in 2015. Built by registration professionals with over 1,000 features to manage every aspect of event registration.</p>
          </div>
          <div className={styles.partnerPlus}>+</div>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogoTrex}>TREX</div>
            <h3>Technical Registration Experts</h3>
            <p>Boutique association management firm founded in 1993. Headquartered in Chicago, serving associations, nonprofits, and corporations nationwide with a personal touch.</p>
          </div>
          <div className={styles.partnerEquals}>=</div>
          <div className={`${styles.partnerCard} ${styles.partnerResult}`}>
            <div className={styles.resultIcon}>🏆</div>
            <h3>Your Complete Registration Solution</h3>
            <p>The best technology backed by the best people. A full-service registration operation that handles everything — from first form to final report.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 style={{ color: 'white' }}>See the Difference for Yourself</h2>
          <p>Schedule a free 30-minute demo with our team and experience the Registration123 + TREX difference firsthand.</p>
          <div className={styles.ctaActions}>
            <Link to="/contact" className={styles.ctaBtn}>Schedule a Free Demo</Link>
            <Link to="/about" className={styles.ctaBtnOutline}>Learn Our Story</Link>
          </div>
        </div>
      </section>

    </main>
  )
}
