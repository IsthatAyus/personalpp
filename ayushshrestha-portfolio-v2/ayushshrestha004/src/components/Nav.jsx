import { Link } from 'react-router-dom';
import { navItems } from '../data';

export default function Nav({
  logo,
  activeSection,
  scrolled,
  menuOpen,
  setMenuOpen,
  scrollToSection,
  hasBlog = false,
  activePage = '',
}) {
  return (
    <>
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <nav className="nav">
          <Link to="/" className="nav-logo" aria-label="Ayush Shrestha, home">
            <img src={logo} alt="Ayush Shrestha logo" />
            <span className="terminal-prompt">ayush@devops:~$</span>
          </Link>

          <div className="nav-links">
            {navItems.map((section, i) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(section); }}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
              >
                <span className="nav-number">0{i + 1}.</span>
                {section}
              </a>
            ))}
            {hasBlog && (
              <Link
                to="/blog/"
                className={`nav-link ${activePage === 'blog' ? 'active' : ''}`}
                aria-current={activePage === 'blog' ? 'page' : undefined}
              >
                <span className="nav-number">0{navItems.length + 1}.</span>
                blog
              </Link>
            )}
            <a
              href="/Ayush_Shrestha_Resume.pdf"
              className="btn-nav-resume"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume ↗
            </a>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </nav>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          {navItems.map((section, i) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(section); }}
              className={`mobile-nav-link ${activeSection === section ? 'active' : ''}`}
            >
              <span className="mobile-nav-number">0{i + 1}.</span>
              {section}
            </a>
          ))}
          {hasBlog && (
            <Link
              to="/blog/"
              className={`mobile-nav-link ${activePage === 'blog' ? 'active' : ''}`}
              aria-current={activePage === 'blog' ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span className="mobile-nav-number">0{navItems.length + 1}.</span>
              blog
            </Link>
          )}
          <a
            href="/Ayush_Shrestha_Resume.pdf"
            className="mobile-resume-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Download Resume ↗
          </a>
        </div>
      </div>

      <div
        className={`menu-overlay ${menuOpen ? 'menu-overlay-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
