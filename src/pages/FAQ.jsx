import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './FAQ.module.css'

const categories = [
  {
    label: 'General',
    faqs: [
      {
        q: 'What exactly does Registration123 do?',
        a: 'Registration123 is both a software platform and a full-service registration management company. You can use our platform to manage your own registrations, or you can have our team handle everything for you — from building your forms to staffing your check-in desk on event day.',
      },
      {
        q: 'Who is behind Registration123?',
        a: 'Registration123 was launched in 2015 by Technical Registration Experts (TREX), a boutique association management firm founded in 1993 in Chicago. TREX has been managing registrations for associations, nonprofits, and corporations for over 30 years.',
      },
      {
        q: 'Do I have to use the software myself, or can your team manage everything?',
        a: 'Both options are available. You can use Registration123 as a self-service platform, or you can engage our Managed Registration Services where our team handles everything. Most clients choose a combination — we configure and manage the platform while they focus on their event.',
      },
      {
        q: 'What types of events do you work with?',
        a: 'We work with conferences and trade shows, nonprofit galas and fundraising events, corporate events, festivals and public events, universities and schools, and medical society conferences. If it requires registration, we can handle it.',
      },
      {
        q: 'Where are you located?',
        a: 'We are headquartered in Chicago, Illinois at 1932 S. Halsted St., Suite 413. We serve clients nationwide and have staffed events across the country.',
      },
    ],
  },
  {
    label: 'Platform & Features',
    faqs: [
      {
        q: 'What features does the Registration123 platform include?',
        a: 'Registration123 includes over 1,000 features including custom registration forms, multi-ticket types, payment processing, automated email communications, real-time reporting, mobile check-in, badge printing, CRM integrations, and data exports — among much more.',
      },
      {
        q: 'Can I customize the registration form to match my brand?',
        a: 'Yes. Registration forms can be fully branded with your logo, colors, and custom fields. We can also build multi-step forms with conditional logic to tailor the experience for different attendee types.',
      },
      {
        q: 'What payment methods does the platform accept?',
        a: 'We accept all major credit cards, ACH bank transfers, and invoicing. Enterprise clients can also accommodate check payments. All payment processing is PCI-compliant and fully secure.',
      },
      {
        q: 'Does Registration123 integrate with our existing tools?',
        a: 'Yes. Registration123 integrates with major CRMs including Salesforce and HubSpot, email platforms like Mailchimp, video platforms like Zoom, and many other tools. We can also work with your team on custom integrations.',
      },
      {
        q: 'Can we handle group registrations?',
        a: 'Absolutely. We support group registration workflows, including company-paid registrations, group discount codes, and multi-attendee management from a single account.',
      },
    ],
  },
  {
    label: 'Managed Services',
    faqs: [
      {
        q: 'What is included in Managed Registration Services?',
        a: 'Our Managed Registration Services include a dedicated registration manager, full form setup and configuration, attendee communication handled by our team, payment processing and reconciliation, custom reporting, cancellation and refund management, and post-event data delivery.',
      },
      {
        q: 'Will we have a dedicated person managing our account?',
        a: 'Yes. Every managed services client is assigned a dedicated registration manager who learns your event inside and out. You\'ll have their direct contact information and they\'ll be available throughout your event cycle.',
      },
      {
        q: 'Can your team handle attendee inquiries directly?',
        a: 'Yes. For managed services clients, our team can serve as the front-line contact for attendee questions about registration, payments, cancellations, and logistics — handling all communication so your staff doesn\'t have to.',
      },
      {
        q: 'Do you provide on-site staffing on event day?',
        a: 'Yes. Our on-site staffing service includes experienced registration professionals who set up and manage your check-in operation, handle walk-in registrations, print badges, manage VIP lanes, and resolve issues in real time.',
      },
    ],
  },
  {
    label: 'Pricing & Billing',
    faqs: [
      {
        q: 'How is Registration123 priced?',
        a: 'We offer per-event pricing starting at $49 for our Starter plan, $149 for Professional, and custom pricing for Enterprise. Managed Registration Services and on-site staffing are priced separately based on your event\'s scope. Contact us for a custom quote.',
      },
      {
        q: 'Are there transaction fees on ticket sales?',
        a: 'Starter and Professional plans include a 2% platform fee on paid ticket sales. Enterprise plans can negotiate flat-fee pricing with no transaction fees.',
      },
      {
        q: 'Do you offer nonprofit discounts?',
        a: 'Yes. We offer 20% off all plans for registered 501(c)(3) organizations. Contact us with your nonprofit documentation to apply the discount.',
      },
      {
        q: 'Can we get a free trial or demo before committing?',
        a: 'Yes. We offer a free 30-minute consultation and demo where we walk you through the platform tailored to your specific event type. We can also set up a test environment so you can experience the system firsthand before making any commitment.',
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}>
      <button className={styles.faqQ} onClick={() => setOpen(o => !o)}>
        {q}
        <span className={styles.faqIcon}>{open ? '−' : '+'}</span>
      </button>
      {open && <div className={styles.faqA}><p>{a}</p></div>}
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('General')

  const current = categories.find(c => c.label === activeCategory)

  return (
    <main className={styles.page}>

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>FAQ</span>
          <h1>Frequently Asked Questions</h1>
          <p className={styles.headerSub}>
            Everything you need to know about Registration123 and our services. 
            Don't see your question? <Link to="/contact" className={styles.headerLink}>Contact us directly.</Link>
          </p>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          {/* Category tabs */}
          <div className={styles.tabs}>
            {categories.map(c => (
              <button
                key={c.label}
                className={`${styles.tab} ${activeCategory === c.label ? styles.tabActive : ''}`}
                onClick={() => setActiveCategory(c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className={styles.faqList}>
            {current?.faqs.map(f => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Still Have Questions?</h2>
        <p>Our team is happy to answer anything. Reach out and we'll get back to you within 2 business hours.</p>
        <Link to="/contact" className={styles.ctaBtn}>Contact Us</Link>
      </section>

    </main>
  )
}
