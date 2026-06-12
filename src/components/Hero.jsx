import React, { useEffect, useState } from 'react';

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid var(--border)',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    padding: '104px 0 72px',
  },
  prompt: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'fadeUp 0.5s ease both',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
  },
  name: {
    fontSize: 'clamp(52px, 8vw, 96px)',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    color: 'var(--text)',
    animation: 'fadeUp 0.6s ease 0.1s both',
    marginBottom: 8,
  },
  title: {
    fontSize: 'clamp(18px, 3vw, 28px)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'var(--accent)',
    letterSpacing: '-0.01em',
    animation: 'fadeUp 0.6s ease 0.2s both',
    marginBottom: 24,
  },
  summary: {
    maxWidth: 760,
    color: 'var(--text-muted)',
    fontSize: 14,
    lineHeight: 1.8,
    animation: 'fadeUp 0.6s ease 0.3s both',
    marginBottom: 40,
  },
  links: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    animation: 'fadeUp 0.6s ease 0.4s both',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    transition: 'all var(--transition)',
    cursor: 'pointer',
    background: 'transparent',
    textDecoration: 'none',
  },
  linkAccent: {
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  location: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    animation: 'fadeUp 0.6s ease 0.5s both',
    marginTop: 32,
  },
  navBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '0 16px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(10,10,10,0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    minWidth: 0,
  },
  navInner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    position: 'relative',
    minWidth: 0,
  },
  navLogo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 'clamp(12px, 2vw, 16px)',
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(8px, 2vw, 16px)',
    listStyle: 'none',
    flexShrink: 0,
    minWidth: 0,
  },
  navLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'color var(--transition)',
    background: 'none',
    border: 'none',
    textDecoration: 'none',
  },
  navToggle: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'var(--bg3)',
    color: 'var(--text)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: 18,
    lineHeight: 1,
    flexShrink: 0,
  },
  themeToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    width: 40,
    height: 40,
    padding: '0 12px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'var(--bg2)',
    color: 'var(--text)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'all var(--transition)',
    flexShrink: 0,
  },
};

function Cursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: 2,
      height: '1em',
      background: 'var(--accent)',
      marginLeft: 4,
      verticalAlign: 'text-bottom',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.1s',
    }} />
  );
}

const NAV_ITEMS = ['experience', 'projects', 'skills', 'education'];

export default function Hero({ profile, navItems = [], themeMode, onThemeToggle }) {
  const [displayText, setDisplayText] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const resolvedTheme = themeMode === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : themeMode;
  const fullTitle = profile?.title ?? 'Software Engineer';
  const hasHeroContent = Boolean(
    profile?.name ||
    profile?.title ||
    profile?.summary ||
    profile?.email ||
    profile?.github_url ||
    profile?.linkedin_url ||
    profile?.location
  );

  const navLinkColor = resolvedTheme === 'light' ? '#64748b' : 'var(--text-muted)';
  const navLinkHoverColor = resolvedTheme === 'light' ? '#2563eb' : 'var(--accent)';

  const navLinkStyle = {
    ...styles.navLink,
    color: navLinkColor,
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullTitle.substring(0, i));
      i++;
      if (i > fullTitle.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullTitle]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasHeroContent) return null;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsNavOpen(false);
  };

  return (
    <>
      <nav style={styles.navBar} className="hero-nav">
        <div style={styles.navInner}>
          <span style={styles.navLogo}>{profile?.name?.split(' ')[0] ?? 'RS'}</span>

          <ul
            style={styles.navLinks}
            className={`hero-nav-links ${isNavOpen ? 'open' : ''}`}
          >
            {(navItems.length ? navItems : NAV_ITEMS).map((id) => (
              <li key={id}>
                <button
                  style={navLinkStyle}
                  onClick={() => scrollTo(id)}
                  onMouseEnter={e => {
                    e.target.style.color = navLinkHoverColor;
                  }}
                  onMouseLeave={e => {
                    e.target.style.color = navLinkColor;
                  }}
                >
                  {id}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            style={styles.themeToggle}
            className="hero-theme-toggle"
            aria-label="Toggle theme"
            onClick={onThemeToggle}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text)';
            }}
          >
            {resolvedTheme === 'dark' ? '☀' : '☾'}
          </button>

          <button
            type="button"
            style={styles.navToggle}
            className="hero-nav-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={isNavOpen}
            onClick={() => setIsNavOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </nav>

      <section style={styles.hero} className="hero-section">
        <div style={styles.grid} />
        <div className="container">
          <div style={styles.inner} className="hero-inner">
            <div style={styles.prompt}>
              <span style={styles.dot} />
              ~/portfolio
              <Cursor />
            </div>
            <h1 style={styles.name} className="hero-name">{profile?.name || 'Your Portfolio'}</h1>
            <p style={styles.title} className="hero-title">
              {displayText}<span style={{ animation: 'blink 1s infinite' }}>_</span>
            </p>
            {profile?.summary && <p style={styles.summary} className="hero-summary">{profile.summary}</p>}
            {(profile?.email || profile?.github_url || profile?.linkedin_url) && (
              <div style={styles.links} className="hero-actions">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    style={{ ...styles.link, ...styles.linkAccent }}
                  >
                    ✉ {profile.email}
                  </a>
                )}
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--text-muted)', color: 'var(--text)' })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--border)', color: 'var(--text-muted)' })}
                  >
                    ⌥ GitHub
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--text-muted)', color: 'var(--text)' })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: 'var(--border)', color: 'var(--text-muted)' })}
                  >
                    ⌘ LinkedIn
                  </a>
                )}
              </div>
            )}
            {profile?.location && <p style={styles.location}>📍 {profile.location}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
