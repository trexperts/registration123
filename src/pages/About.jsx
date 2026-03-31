import { Link } from 'react-router-dom'
import styles from './About.module.css'

const timeline = [
  {
    year: '1993',
    title: 'Technical Registration Experts Founded',
    desc: 'Kimberly Miller co-founds TREX in Chicago after acquiring Phoenix Solutions, Inc. — bringing deep expertise in meeting management and association software to a new kind of firm.',
  },
  {
    year: '1996',
    title: 'Jeffrey Miller Joins',
    desc: 'Jeff Miller joins the team, combining technology expertise with association management knowledge to expand TREX\'s capabilities and client roster.',
  },
  {
    year: '2002',
    title: 'Partnership with Medical Society Management',
    desc: 'TREX partners with Medical Society Management, Inc. (MSM) to provide full management solutions to nonprofit medical societies — becoming their official headquarters for client support.',
  },
  {
    year: '2015',
    title: 'Registration123 Launched',
    desc: 'Drawing on 22 years of hands-on registration experience, TREX launches Registration123 — a modern, web-based registration platform built by registration professionals, for registration professionals.',
  },
  {
    year: 'Today',
    title: 'Your Full-Service Registration Partner',
    desc: 'With over 30 years of combined expertise, Registration123 and TREX serve associations, nonprofits, corporations, and universities nationwide — handling every aspect of event registration so you don\'t have to.',
  },
]

const values = [
  {
    icon: '🤝',
    title: 'We Become Your Team',
    desc: 'We don\'t hand you software and wish you luck. We become an extension of your organization — learning your event, your audience, and your goals inside and out.',
  },
  {
    icon: '🎯',
    title: 'No One-Size-Fits-All',
    desc: 'Every event is different. We tailor our tools and services to your specific needs, whether that\'s a 50-person board meeting or a 5,000-person national conference.',
  },
  {
    icon: '📍',
    title: 'Chicago Roots, Nationwide Reach',
    desc: 'Headquartered at 1932 S. Halsted St. in Chicago, we\'ve managed events in every corner of the country. Local relationships, national capability.',
  },
  {
    icon: '🔒',
    title: 'Accountability You Can Count On',
    desc: 'When you work with us, you have a dedicated team — real people with names and direct lines — who are personally invested in making your event a success.',
  },
]

const leadership = [
  {
    initials: 'KM',
    color: '#1a3399',
    name: 'Kimberly Miller',
    title: 'President & CEO, Technical Registration Experts',
    bio: 'Co-founder of TREX with over 30 years in association management and event registration. Kimberly built TREX from the ground up after learning the industry at Phoenix Solutions, where she trained meeting planners and association executives nationwide.',
  },
  {
    initials: 'JM',
    color: '#e85d14',
    name: 'Jeffrey Miller',
    title: 'Vice President, Technical Registration Experts',
    bio: 'Jeff joined TREX in 1996, bringing a blend of technology expertise and industry knowledge that helped shape both the firm\'s growth and the development of the Registration123 platform.',
  },
]

export default function About() {
  return (
    <main className={styles.page}>

      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Our Story</span>
          <h1>30+ Years of Registration Expertise,<br />One Trusted Partnership</h1>
          <p className={styles.headerSub}>
            Registration123 is powered by Technical Registration Experts (TREX) — a Chicago-based 
            association management firm founded in 1993. Together, we combine modern registration 
            technology with decades of on-the-ground experience to handle everything registration 
            for your organization.
          </p>
          <div className={styles.headerStats}>
            <div className={styles.hStat}><strong>1993</strong><span>TREX Founded</span></div>
            <div className={styles.hDivider} />
            <div className={styles.hStat}><strong>2015</strong><span>Registration123 Launched</span></div>
            <div className={styles.hDivider} />
            <div className={styles.hStat}><strong>30+</strong><span>Years of Expertise</span></div>
            <div className={styles.hDivider} />
            <div className={styles.hStat}><strong>Chicago, IL</strong><span>Headquartered</span></div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <div className={styles.missionText}>
            <span className={styles.sectionLabel}>Our Mission</span>
            <h2>We Are Your Registration Office</h2>
            <p>
              Most registration companies give you a tool and leave you to figure it out. 
              We do something different: we become your registration department.
            </p>
            <p>
              From the moment you decide to hold an event, our team is with you — building 
              your forms, managing your attendees, processing your payments, staffing your 
              check-in desk, and handling every detail in between.
            </p>
            <p>
              That's the TREX difference. And it's the foundation Registration123 was built on.
            </p>
            <Link to="/services" className={styles.missionBtn}>See How We Work →</Link>
          </div>
          <div className={styles.missionCard}>
            <div className={styles.quoteIcon}>"</div>
            <p className={styles.quoteText}>
              We don't believe in one-size-fits-all solutions, and you'll never be just a 
              number to us. At TREX, we take the time to understand your mission and become 
              fully invested in your goals. Your organization becomes our priority.
            </p>
            <div className={styles.quoteAuthor}>
              <div className={styles.quoteAvatar} style={{ background: '#1a3399' }}>KM</div>
              <div>
                <strong>Kimberly Miller</strong>
                <span>President & CEO, Technical Registration Experts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timeline}>
        <div className={styles.timelineInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Our History</span>
            <h2>Three Decades in the Making</h2>
          </div>
          <div className={styles.timelineList}>
            {timeline.map((t, i) => (
              <div key={t.year} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{t.year}</div>
                <div className={styles.timelineLine}>
                  <div className={styles.timelineDot} />
                  {i < timeline.length - 1 && <div className={styles.timelineConnector} />}
                </div>
                <div className={styles.timelineContent}>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className={styles.valuesInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>What We Stand For</span>
            <h2>How We Work</h2>
            <p className={styles.sectionSub}>
              These aren't just words on a page — they're the principles that have kept 
              our clients coming back for 30 years.
            </p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className={styles.leadership}>
        <div className={styles.leadershipInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Leadership</span>
            <h2>The People Behind the Platform</h2>
          </div>
          <div className={styles.leaderGrid}>
            {leadership.map(l => (
              <div key={l.name} className={styles.leaderCard}>
                <div className={styles.leaderAvatar} style={{ background: l.color }}>{l.initials}</div>
                <h3>{l.name}</h3>
                <div className={styles.leaderTitle}>{l.title}</div>
                <p>{l.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to Work With a Team That Actually Knows Registration?</h2>
        <p>Let's talk about your next event. No sales pitch — just a real conversation about what you need.</p>
        <div className={styles.ctaActions}>
          <Link to="/contact" className={styles.ctaBtn}>Schedule a Free Consultation</Link>
          <Link to="/services" className={styles.ctaBtnOutline}>See Our Services</Link>
        </div>
      </section>

    </main>
  )
}
