import { navItems } from '../data';

export default function Nav({
  logo,
  activeSection,
  scrolled,
  menuOpen,
  setMenuOpen,
  scrollToSection,
}) {
  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <nav className="nav">
        <div className="nav-logo">
          <img src={logo} alt="Ayush Shrestha" />
          <span className="terminal-prompt">ayush@devops:~$</span>
        </div>

        <div className="nav-links">
          {navItems.map((section, i) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`nav-link ${activeSection === section ? 'active' : ''}`}
            >
              <span className="nav-number">0{i + 1}.</span>
              {section}
            </button>
          ))}
          <a
            href="/resume.pdf"
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

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          {navItems.map((section, i) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`mobile-nav-link ${activeSection === section ? 'active' : ''}`}
            >
              <span className="mobile-nav-number">0{i + 1}.</span>
              {section}
            </button>
          ))}
          <a
            href="/resume.pdf"
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
    </header>
  );
}
