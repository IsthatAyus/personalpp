import { Link } from 'react-router-dom';

export default function SiteFooter({ hasBlog = false }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Designed &amp; Built by <strong>Ayush Shrestha</strong></p>
        <p className="footer-tech">React · Vite · GSAP · Love for DevOps</p>
        {hasBlog && (
          <p className="footer-tech"><Link to="/blog/">Read the blog →</Link></p>
        )}
      </div>
    </footer>
  );
}
