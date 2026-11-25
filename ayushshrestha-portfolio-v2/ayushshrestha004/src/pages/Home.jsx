import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/ayush-high-resolution-logo-transparent.png';
import pp from '../assets/ayush-shrestha.jpeg';
import { navItems } from '../data';
import Nav from '../components/Nav';
import SiteFooter from '../components/SiteFooter';
import Hero from '../components/Hero';
import PipelineTrail from '../components/PipelineTrail';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import RecentBlogs from '../components/RecentBlogs';
import { posts } from '../blog/posts';

export default function Home() {
  const [activeSection, setActiveSection] = useState('about');
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { hash } = useLocation();
  const hasBlog = posts.length > 0;

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
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 120);
    return () => clearTimeout(t);
  }, [hash]);

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
        hasBlog={hasBlog}
      />

      <Hero scrollToSection={scrollToSection} />
      <About photo={pp} />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <RecentBlogs posts={posts} />

      <SiteFooter hasBlog={hasBlog} />
    </div>
  );
}

