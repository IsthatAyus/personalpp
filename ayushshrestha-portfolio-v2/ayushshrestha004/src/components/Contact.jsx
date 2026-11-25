import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-text > *', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
      gsap.from('.contact-card', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="section contact-section" ref={rootRef}>
      <div className="section-content">
        <div className="section-label">
          <span className="label-number">04</span>
          <span className="label-text">Contact</span>
        </div>

        <div className="contact-content">
          <div className="contact-text">
            <h2 className="section-title">Let's Build Something Amazing</h2>
            <p>
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision. Whether you need DevOps
              expertise, want to collaborate, or just want to connect — let's talk.
            </p>
          </div>

          <div className="contact-grid">
            <a href="mailto:ayushshrestha796@gmail.com" className="contact-card">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-info">
                <div className="contact-label">Email</div>
                <div className="contact-value">ayushshrestha796@gmail.com</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/ayush-shrestha-18b8b621a/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div className="contact-info">
                <div className="contact-label">LinkedIn</div>
                <div className="contact-value">Connect with me</div>
              </div>
            </a>

            <a
              href="https://github.com/IsthatAyus"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <div className="contact-info">
                <div className="contact-label">GitHub</div>
                <div className="contact-value">View my code</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
