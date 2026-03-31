import { Link } from 'react-router-dom'
import styles from './Pricing.module.css'

const plans = [
  {
    name: 'Starter',
    price: 49,
    period: 'per event',
    desc: 'Perfect for small events and organizations just getting started.',
    highlight: false,
    features: [
      'Up to 250 registrants',
      'Custom registration form',
      'Email confirmations',
      'Basic reporting',
      'Credit card payments',
      'Mobile check-in app',
      'Email support',
    ],
    cta: 'Get Started',
    ctaLink: '/contact',
  },
  {
    name: 'Professional',
    price: 149,
    period: 'per event',
    desc: 'For growing organizations managing mid-size events with more complexity.',
    highlight: true,
    features: [
      'Up to 1,000 registrants',
      'Multi-ticket types & pricing',
      'Automated email sequences',
      'Advanced analytics & exports',
      'ACH & invoice payments',
      'On-site badge printing',
      'CRM integrations (HubSpot, Salesforce)',
      'Priority phone & email support',
    ],
    cta: 'Most Popular — Get Started',
    ctaLink: '/contact',
  },
  {
    name: 'Enterprise',
    price: null,
    period: 'custom pricing',
    desc: 'For large organizations running multiple events with enterprise requirements.',
    highlight: false,
    features: [
      'Unlimited registrants',
      'Unlimited events',
      'White-label branding',
      'SSO & custom authentication',
      'Dedicated account manager',
      'Custom integrations & API access',
      'SLA guarantee',
      'On-site event staff support',
      '24/7 priority support',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — we offer a free 30-minute demo and will set up a test environment for your specific event type so you can see exactly how it works before committing.',
  },
  {
    q: 'Are there transaction fees on top of the plan price?',
    a: 'Our Starter and Professional plans include a 2% platform fee on paid ticket sales. Enterprise plans can negotiate flat-fee pricing with no transaction fees.',
  },
  {
    q: 'Can I switch plans mid-event?',
    a: 'Yes. You can upgrade at any time and we\'ll prorate the difference. Downgrades take effect at the start of your next event.',
  },
  {
    q: 'Do you offer nonprofit discounts?',
    a: 'Absolutely. We offer 20% off all plans for registered 501(c)(3) organizations. Contact our sales team with your nonprofit documentation.',
  },
  {
    q: 'What payment methods do you support?',
    a: 'We support all major credit cards, ACH bank transfers, and invoicing on Professional and Enterprise plans. We can also support check payments for Enterprise clients.',
  },
  {
    q: 'Do you offer refunds if we cancel?',
    a: 'Per-event plans are refundable up to 14 days before your event date. Annual Enterprise contracts are subject to individual agreement terms.',
  },
]

export default function Pricing() {
  return (
    <main className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Transparent Pricing</span>
          <h1>Simple Plans for Every Event Size</h1>
          <p className={styles.headerSub}>
            No hidden fees, no surprise charges. Pay per event on Starter and Professional,
            or get an annual Enterprise contract for maximum flexibility.
          </p>
        </div>
      </div>

      {/* Plans */}
      <section className={styles.plans}>
        <div className={styles.plansGrid}>
          {plans.map(plan => (
            <div key={plan.name} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}>
              {plan.highlight && <div className={styles.popularBadge}>Most Popular</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                {plan.price
                  ? <><span className={styles.dollar}>$</span>{plan.price}</>
                  : <span className={styles.custom}>Custom</span>
                }
              </div>
              <div className={styles.planPeriod}>{plan.period}</div>
              <p className={styles.planDesc}>{plan.desc}</p>
              <Link to={plan.ctaLink} className={plan.highlight ? styles.planBtnPrimary : styles.planBtn}>
                {plan.cta}
              </Link>
              <ul className={styles.featureList}>
                {plan.features.map(f => (
                  <li key={f}>
                    <span className={styles.check}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqGrid}>
            {faqs.map(f => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Not Sure Which Plan Is Right for You?</h2>
        <p>Schedule a free consultation and we'll recommend the best fit for your event size and budget.</p>
        <Link to="/contact" className={styles.ctaBtn}>Talk to Our Team</Link>
      </section>

    </main>
  )
}
