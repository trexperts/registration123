import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]

const appLinks = [
  { label: 'Committee Pairing', href: '/committee-match' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [appsOpen, setAppsOpen] = useState(false)
  const { pathname } = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAppsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isAppsActive = appLinks.some(a => pathname.startsWith(a.href))

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <div className={styles.logoIcon}>
            <span className={styles.logoNum}>123</span>
            <svg className={styles.logoCheck} viewBox="0 0 14 10" fill="none">
              <polyline points="1,5 5,9 13,1" stroke="#e85d14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.logoR}>R</span>
          </div>
          <span className={styles.logoText}>
            <span>Registration</span><em>123</em>
          </span>
        </Link>

        <ul className={styles.links}>
          {navLinks.map(l => (
            <li key={l.label}>
              <Link to={l.href} className={pathname === l.href ? styles.active : ''}>{l.label}</Link>
            </li>
          ))}
          <li className={styles.dropdown} ref={dropdownRef}>
            <button
              className={`${styles.dropdownTrigger} ${isAppsActive ? styles.active : ''}`}
              onClick={() => setAppsOpen(o => !o)}
            >
Apps <span className={`${styles.caret} ${appsOpen ? styles.caretOpen : ''}`} />            </button>
            {appsOpen && (
              <div className={styles.dropdownMenu}>
                {appLinks.map(a => (
                  <Link
                    key={a.label}
                    to={a.href}
                    className={styles.dropdownItem}
                    onClick={() => setAppsOpen(false)}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        <div className={styles.navRight}>
          <Link to="/contact" className={styles.navCta}>Request a Demo</Link>
          <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span className={menuOpen ? styles.bar1Open : styles.bar1} />
            <span className={menuOpen ? styles.bar2Open : styles.bar2} />
            <span className={menuOpen ? styles.bar3Open : styles.bar3} />
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        {navLinks.map(l => (
          <Link key={l.label} to={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className={styles.mobileAppsSection}>
          <span className={styles.mobileAppsLabel}>Apps</span>
          {appLinks.map(a => (
            <Link key={a.label} to={a.href} className={styles.mobileAppLink} onClick={() => setMenuOpen(false)}>
              {a.label}
            </Link>
          ))}
        </div>
        <Link to="/contact" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
          Request a Demo →
        </Link>
      </div>
    </nav>
  )
}