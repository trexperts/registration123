import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const clients = [
  'Conferences & Trade Shows',
  'Nonprofit Galas',
  'Corporate Events',
  'Festivals',
  'Universities',
]

const features = [
  { icon: '🎟️', title: 'Custom Registration Forms', desc: 'Build branded, multi-step forms with conditional logic, custom fields, and multiple ticket tiers — no coding required.' },
  { icon: '💳', title: 'Secure Payment Processing', desc: 'Accept credit cards, ACH, and invoicing. Automated receipts, refunds, and revenue reporting included.' },
  { icon: '📧', title: 'Automated Communications', desc: 'Confirmation emails, countdown reminders, and post-event follow-ups delivered automatically to every attendee.' },
  { icon: '📊', title: 'Real-Time Reporting', desc: 'Live dashboards showing registrations, revenue, attendance trends, and exportable data for your stakeholders.' },
  { icon: '📱', title: 'On-Site Check-In', desc: 'QR code scanning, badge printing, and walk-in registration — all from a phone or tablet at the door.' },
  { icon: '🔗', title: '100+ Integrations', desc: 'Connects with Salesforce, HubSpot, Zoom, Mailchimp, and your existing tech stack out of the box.' },
]

const industries = [
  {
    icon: '🏛️',
    label: 'Conferences & Trade Shows',
    desc: 'Multi-session agendas, speaker bios, sponsor tiers, and exhibitor management.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=260&fit=crop&auto=format',
  },
  {
    icon: '🎗️',
    label: 'Nonprofits & Galas',
    desc: 'Donation collection, table management, auction items, and donor tracking.',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=260&fit=crop&auto=format',
  },
  {
    icon: '🏢',
    label: 'Corporate Events',
    desc: 'Internal registration, SSO login, approval workflows, and budget tracking.',
    img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=260&fit=crop&auto=format',
  },
  {
    icon: '🎡',
    label: 'Festivals & Public Events',
    desc: 'High-volume ticket sales, timed entry, wristband management, and vendor portals.',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=260&fit=crop&auto=format',
  },
  {
    icon: '🎓',
    label: 'Universities & Schools',
    desc: 'Student verification, faculty portals, group registration, and campus billing.',
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=260&fit=crop&auto=format',
  },
]

const testimonials = [
  {
    initials: 'MR',
    color: '#1a3399',
    quote: 'We switched from a clunky legacy system to Registration123 and processed 1,200 conference registrations without a single issue. The support team is exceptional.',
    name: 'Marcus Reed',
    role: 'Conference Director, TechWorld Summit',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
  },
  {
    initials: 'JP',
    color: '#e85d14',
    quote: 'Our annual gala raised 40% more this year. The donation integration and donor tracking alone paid for the platform ten times over.',
    name: 'Jennifer Park',
    role: 'Executive Director, Chicago Arts Foundation',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
  },
  {
    initials: 'TW',
    color: '#2a9d8f',
    quote: 'Registration123 handles 40+ fundraising events a year for us nationwide. The reporting gives our board exactly what they need every time.',
    name: 'Thomas Walsh',
    role: 'VP Events, Walsh Philanthropies',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format',
  },
]

const stats = [
  { number: '10K+', label: 'Events Managed' },
  { number: '2M+', label: 'Registrations Processed' },
  { number: '$180M+', label: 'Revenue Collected' },
  { number: '98%', label: 'Client Retention Rate' },
]

export default function Home() {
  return (
    <main className={styles.main}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Trusted by event professionals nationwide
            </div>
            <h1>
              The Registration Platform<br />
              <span className={styles.accent}>Built for Serious Events.</span>
            </h1>
            <p className={styles.heroSub}>
              Registration123 gives event organizers enterprise-grade tools to manage registrations,
              payments, communications, and check-in — all in one platform. From 50-person workshops
              to 10,000-person conferences.
            </p>
            <div className={styles.heroActions}>
              <Link to="/contact" className={styles.btnPrimary}>
                Request a Demo <ArrowIcon />
              </Link>
              <Link to="/pricing" className={styles.btnSecondary}>View Pricing</Link>
            </div>
            <div className={styles.clientTypes}>
              <span>Serving:</span>
              {clients.map(c => <span key={c} className={styles.clientPill}>{c}</span>)}
            </div>
          </div>

          {/* Hero image */}
          <div className={styles.heroVisual}>
            <div className={styles.heroImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&h=500&fit=crop&auto=format"
                alt="Event registration and conference management"
                className={styles.heroImg}
              />
              <div className={styles.heroImgOverlay} />
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard1}`}>
              <div className={styles.floatIcon}>✅</div>
              <div>
                <strong>1,247 Registered</strong>
                <span>National Tech Conference</span>
              </div>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard2}`}>
              <div className={styles.floatIcon}>📊</div>
              <div>
                <strong>$94,320 Revenue</strong>
                <span>This event · 73% capacity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className={styles.stats}>
        {stats.map(s => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statNum}>{s.number}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className={styles.features}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Platform Features</span>
          <h2>Everything Your Event Needs,<br />Nothing You Don't</h2>
          <p className={styles.sectionSub}>
            A complete registration management system designed for professional event organizers
            who can't afford downtime, errors, or a poor attendee experience.
          </p>
        </div>
        <div className={styles.featGrid}>
          {features.map(f => (
            <div key={f.title} className={styles.featCard}>
              <div className={styles.featIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className={styles.industries}>
        <div className={styles.industriesInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel} style={{ color: 'var(--orange-light)' }}>Who We Serve</span>
            <h2 style={{ color: 'white' }}>Built for Every Type of Event</h2>
            <p className={styles.sectionSub} style={{ color: 'rgba(255,255,255,0.6)' }}>
              From intimate fundraising dinners to massive trade shows,
              Registration123 scales to match your event's complexity.
            </p>
          </div>
          <div className={styles.industryGrid}>
            {industries.map(i => (
              <div key={i.label} className={styles.industryCard}>
                <div className={styles.industryImgWrap}>
                  <img src={i.img} alt={i.label} className={styles.industryImg} />
                  <div className={styles.industryImgOverlay} />
                  <div className={styles.industryIconBadge}>{i.icon}</div>
                </div>
                <div className={styles.industryBody}>
                  <h3>{i.label}</h3>
                  <p>{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.how}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>How It Works</span>
          <h2>Up and Running in Under an Hour</h2>
          <p className={styles.sectionSub}>
            No lengthy onboarding. No IT department required.
            Our team helps you launch your first event fast.
          </p>
        </div>
        <div className={styles.steps}>
          {[
            { num: '01', title: 'Schedule a Demo', desc: 'We walk you through the platform and tailor a setup plan for your specific event type and size.' },
            { num: '02', title: 'We Build Your Event', desc: 'Our team configures your registration form, ticket types, payment setup, and branding — done for you.' },
            { num: '03', title: 'Launch & Manage', desc: 'Share your registration link and manage everything from one dashboard. We\'re on call if you need us.' },
          ].map(s => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum}>{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Client Results</span>
          <h2>Trusted by Event Professionals<br />Across the Country</h2>
        </div>
        <div className={styles.testiGrid}>
          {testimonials.map(t => (
            <div key={t.name} className={styles.testiCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.author}>
                <img
                  src={t.img}
                  alt={t.name}
                  className={styles.authorImg}
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className={styles.authorAvatar} style={{ background: t.color, display: 'none' }}>{t.initials}</div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <span className={styles.sectionLabel} style={{ color: 'var(--orange-light)' }}>Get Started</span>
          <h2 style={{ color: 'white' }}>Ready to Simplify<br />Your Next Event?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Schedule a free 30-minute demo and see how Registration123 can handle
            your entire registration process from start to finish.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/contact" className={styles.btnPrimary}>Schedule a Free Demo</Link>
            <Link to="/pricing" className={styles.btnOutline}>View Pricing Plans</Link>
          </div>
        </div>
      </section>

    </main>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
