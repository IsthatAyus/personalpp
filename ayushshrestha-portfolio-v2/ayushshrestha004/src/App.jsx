import { useState, useEffect } from 'react';
import logo from './assets/ayush-high-resolution-logo-transparent.png';
import pp from './assets/pp.jpeg';
import { navItems } from './data';
import Nav from './components/Nav';
import Hero from './components/Hero';
import PipelineTrail from './components/PipelineTrail';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsLoaded(true));

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const scrollPos = window.scrollY + 220;
      for (const section of navItems) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top && scrollPos < top + el.offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
      menuOpen ? 280 : 0
    );
  };

  return (
    <div className={`portfolio ${isLoaded ? 'loaded' : ''}`}>
      <PipelineTrail />

      <Nav
        logo={logo}
        activeSection={activeSection}
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
      />

      <Hero scrollToSection={scrollToSection} />
      <About photo={pp} />
      <Projects />
      <Skills />
      <Contact />

      <footer className="footer">
        <div className="footer-content">
          <p>Designed &amp; Built by <strong>Ayush Shrestha</strong></p>
          <p className="footer-tech">React · Vite · GSAP · Love for DevOps</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
