import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ayush-high-resolution-logo-transparent.png';
import Nav from './Nav';
import SiteFooter from './SiteFooter';
import { posts } from '../blog/posts';
import '../blog/blog.css';

export default function BlogLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const hasBlog = posts.length > 0;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollToSection = (section) => {
    setMenuOpen(false);
    navigate(`/#${section}`);
  };

  return (
    <div className="blog-shell">
      <Nav
        logo={logo}
        activeSection=""
        scrolled
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
        hasBlog={hasBlog}
        activePage="blog"
      />

      <main className="blog-page">{children}</main>

      <SiteFooter hasBlog={hasBlog} />
    </div>
  );
}
