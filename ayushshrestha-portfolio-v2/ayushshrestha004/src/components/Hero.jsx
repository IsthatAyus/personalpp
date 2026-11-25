import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { scrambleTo } from '../motion';

const COMMANDS = [
  '$ terraform apply --auto-approve',
  '$ kubectl rollout status deploy/api',
  '$ docker build -t app:latest .',
  '$ ansible-playbook provision.yml',
  '$ helm upgrade --install prod ./chart',
];

function MiniTerminal() {
  const [lineIndex, setLineIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [phase, setPhase] = useState('typing');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = COMMANDS[lineIndex];
    let timeout;
    if (phase === 'typing') {
      if (charIndex < current.length) {
        timeout = setTimeout(() => {
          setDisplay(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, 45);
      } else {
        timeout = setTimeout(() => setPhase('erasing'), 1500);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplay(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, 22);
      } else {
        timeout = setTimeout(() => {
          setLineIndex((i) => (i + 1) % COMMANDS.length);
          setPhase('typing');
        }, 0);
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, charIndex, lineIndex]);

  return (
    <div className="mini-terminal">
      <div className="mini-terminal-bar">
        <span className="t-dot red" />
        <span className="t-dot yellow" />
        <span className="t-dot green" />
      </div>
      <div className="mini-terminal-body">
        <span className="t-cmd">{display}</span>
        <span className="t-cursor" />
      </div>
    </div>
  );
}

export default function Hero({ scrollToSection }) {
  const rootRef = useRef(null);
  const nameRef = useRef(null);
  const primaryBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nameText = nameRef.current?.dataset?.name ?? nameRef.current?.textContent ?? '';
      if (nameRef.current) nameRef.current.textContent = '';

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', { y: 16, opacity: 0, duration: 0.5 })
        // Name decrypts out of noise instead of just fading up.
        .call(() => scrambleTo(nameRef.current, nameText, { duration: 0.95 }))
        .from('.title-role', { y: 24, opacity: 0, duration: 0.6, ease: 'expo.out' }, '-=0.3')
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.55 }, '-=0.35')
        .from('.mini-terminal', {
          scaleY: 0, opacity: 0, duration: 0.5, ease: 'power4.out', transformOrigin: 'top',
        }, '-=0.3')
        .from('.hero-cta > *', {
          y: 16, opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)',
        }, '-=0.25')
        .from('.status-pill', {
          y: 12, opacity: 0, scale: 0.85, duration: 0.5, stagger: 0.12, ease: 'back.out(1.8)',
        }, '-=0.3');

      // Gentle ambient float for the status pills.
      gsap.to('.status-pill', {
        y: '+=10',
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: 'random' },
      });

    }, rootRef);

    // Magnetic pull on the primary CTA — outside gsap.context since it's
    // a live listener, not a one-off tween to revert.
    const btn = primaryBtnRef.current;
    let onMove, onLeave;
    if (btn) {
      const strength = 0.4;
      onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(btn, { x: relX * strength, y: relY * strength, duration: 0.35, ease: 'power2.out' });
      };
      onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
    }

    return () => {
      ctx.revert();
      if (btn) {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      }
    };
  }, []);

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero-bg">
        <div className="grid-pattern" />
      </div>

      <div className="status-pill pill-1">✓ Build passing</div>
      <div className="status-pill pill-2">🚀 Deployed to prod</div>
      <div className="status-pill pill-3">100% uptime</div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="status-dot" />
          Available for opportunities
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line title-name" data-name="Ayush Shrestha" ref={nameRef}>Ayush Shrestha</span>
          <span className="hero-title-line title-role">DevOps Engineer &amp; Fullstack Developer</span>
        </h1>

        <p className="hero-subtitle">
          I design reliable infrastructure and build the products that run on it —
          from CI/CD pipelines to the apps they ship.
        </p>

        <MiniTerminal />

        <div className="hero-cta">
          <button
            onClick={() => scrollToSection('projects')}
            className="btn btn-primary"
            ref={primaryBtnRef}
          >
            View Projects
          </button>
          <a href="/resume.pdf" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
            Download Resume
          </a>
          <button onClick={() => scrollToSection('contact')} className="btn btn-outline">
            Contact
          </button>
        </div>
      </div>

      <div className="hero-scroll">
        <span>scroll</span>
        <div className="scroll-indicator" />
      </div>
    </section>
  );
}