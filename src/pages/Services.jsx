import { Link } from 'react-router-dom'
import styles from './Services.module.css'

const services = [
  {
    icon: '💻',
    tag: 'The Platform',
    title: 'Registration123 Software',
    desc: 'A powerful, web-based registration system with over 1,000 features. Use our platform to build your own registration forms, manage attendees, process payments, and communicate with registrants — all from one dashboard.',
    features: [
      'Custom registration forms with conditional logic',
      'Multi-ticket types and tiered pricing',
      'Credit card, ACH, and invoice payments',
      'Automated email confirmations and reminders',
      'Real-time dashboards and reporting',
      'Mobile check-in and badge printing',
      'CRM integrations (Salesforce, HubSpot, and more)',
      'Unlimited data exports',
    ],
    cta: 'See Pricing',
    ctaLink: '/pricing',
    highlight: false,
  },
  {
    icon: '🏢',
    tag: 'Full-Service',
    title: 'Managed Registration Services',
    desc: 'Let our team handle everything. We act as your dedicated registration office — building your forms, managing your attendee database, processing payments, answering registrant questions, and delivering reports to your leadership.',
    features: [
      'Dedicated registration manager assigned to your event',
      'We build and configure all your registration forms',
      'Attendee communication handled by our team',
      'Payment processing and financial reconciliation',
      'Custom reporting for your board or stakeholders',
      'Pre-event attendee list management',
      'Cancellation and refund processing',
      'Post-event data delivery and archiving',
    ],
    cta: 'Request a Consultation',
    ctaLink: '/contact',
    highlight: true,
  },
  {
    icon: '📍',
    tag: 'On-Site',
    title: 'On-Site Event Staffing',
    desc: 'Our experienced staff come to your event and run the entire registration operation from the ground up. From check-in tables to badge printing to walk-in registration — we\'re there so your team doesn\'t have to be.',
    features: [
      'Professional on-site registration staff',
      'Check-in desk setup and management',
      'QR code scanning and badge printing',
      'Walk-in and day-of registration',
      'Real-time attendance tracking',
      'VIP and speaker check-in lanes',
      'Troubleshooting and attendee support',
      'Post-event wrap report',
    ],
    cta: 'Talk to Our Team',
    ctaLink: '/contact',
    highlight: false,
  },
]

const addons = [
  { icon: '📊', title: 'Association Management', desc: 'Full-service association management including board governance, financial management, and member communications — powered by TREX.' },
  { icon: '📝', title: 'Project-Based Consulting', desc: 'Need help with a specific piece of your event or association? We offer consulting engagements on any aspect of registration or event management.' },
  { icon: '🏥', title: 'Medical Society Support', desc: 'Through our partnership with Medical Society Management, Inc., we provide specialized support for nonprofit medical societies and CME events.' },
  { icon: '📣', title: 'Marketing & Communications', desc: 'Event promotion, email campaigns, and attendee communications designed and executed by our team.' },
]

export default function Services() {
  return (
    <main className={styles.page}>

      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>What We Offer</span>
          <h1>Every Registration Service<br />Under One Roof</h1>
          <p className={styles.headerSub}>
            From a powerful self-service platform to a fully managed registration office, 
            Registration123 and TREX offer the right level of support for every organization and event.
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className={styles.services}>
        <div className={styles.servicesInner}>
          {services.map(s => (
            <div key={s.title} className={`${styles.serviceCard} ${s.highlight ? styles.serviceHighlight : ''}`}>
              {s.highlight && <div className={styles.popularTag}>Most Popular</div>}
              <div className={styles.serviceIcon}>{s.icon}</div>
              <div className={styles.serviceTag}>{s.tag}</div>
              <h2>{s.title}</h2>
              <p className={styles.serviceDesc}>{s.desc}</p>
              <ul className={styles.featureList}>
                {s.features.map(f => (
                  <li key={f}><span className={styles.check}>✓</span>{f}</li>
                ))}
              </ul>
              <Link to={s.ctaLink} className={s.highlight ? styles.btnPrimary : styles.btnSecondary}>
                {s.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className={styles.addons}>
        <div className={styles.addonsInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Additional Services</span>
            <h2>More Ways We Can Help</h2>
            <p className={styles.sectionSub}>
              Through our partnership with TREX and Medical Society Management, Inc., 
              we offer a full suite of association and event services beyond registration.
            </p>
          </div>
          <div className={styles.addonsGrid}>
            {addons.map(a => (
              <div key={a.title} className={styles.addonCard}>
                <div className={styles.addonIcon}>{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.process}>
        <div className={styles.processInner}>
          <div className={styles.sectionHead} style={{ textAlign: 'left', maxWidth: '480px' }}>
            <span className={styles.sectionLabel} style={{ color: 'var(--orange-light)' }}>Our Process</span>
            <h2 style={{ color: 'white' }}>What Working With Us Looks Like</h2>
          </div>
          <div className={styles.processSteps}>
            {[
              { num: '01', title: 'Discovery Call', desc: 'We learn about your event, your organization, your audience, and what\'s worked (or hasn\'t) in the past.' },
              { num: '02', title: 'Custom Proposal', desc: 'We recommend the right mix of platform and services for your needs and budget — no upselling, just the right fit.' },
              { num: '03', title: 'We Get to Work', desc: 'Our team builds your registration setup, tests everything, and has it ready to launch on your timeline.' },
              { num: '04', title: 'Ongoing Support', desc: 'From launch through event day and beyond, we\'re your dedicated registration team — available when you need us.' },
            ].map(s => (
              <div key={s.num} className={styles.processStep}>
                <div className={styles.processNum}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Not Sure Which Service Is Right for You?</h2>
        <p>Schedule a free 30-minute consultation and we'll help you figure out exactly what you need.</p>
        <Link to="/contact" className={styles.ctaBtn}>Schedule a Free Consultation</Link>
      </section>

    </main>
  )
}
