import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 1, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Projects Completed' },
  { value: 6, suffix: '', label: 'Full-stack Apps Shipped' },
];

export default function About({ photo }) {
  const rootRef = useRef(null);
  const statRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-image-wrapper', {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });

      gsap.from('.about-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i].value;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = Math.round(counter.val) + STATS[i].suffix;
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section about-section" ref={rootRef}>
      <div className="section-content">
        <div className="section-label">
          <span className="label-number">01</span>
          <span className="label-text">About</span>
        </div>

        <div className="about-grid">
          <div className="about-image-wrapper">
            <div className="image-frame">
              <img src={photo} alt="Ayush Shrestha" className="about-image" />
              <div className="image-overlay" />
            </div>
            <div className="image-decoration" />
          </div>

          <div className="about-content">
            <h2 className="section-title">
              Building the Future<br />of Software &amp; Infrastructure
            </h2>
            <div className="about-text">
              <p>
                I'm a <strong>second-year student</strong> at Malpi International College
                with an intense passion for{' '}
                <span className="highlight">DevOps and cloud technologies</span>.
                Currently interning as a DevOps Engineer, I work hands-on with CI/CD
                pipelines, infrastructure as code, and container orchestration.
              </p>
              <p>
                Alongside that, I build <strong>full-stack products end to end</strong> —
                from PostgreSQL schemas and Express APIs to the React interfaces on top,
                then containerize and ship the whole thing myself.
              </p>
              <p>
                Beyond the terminal, I'm an aspiring entrepreneur with dreams of creating
                impactful technology ventures that solve real-world problems.
              </p>
            </div>

            <div className="about-stats">
              {STATS.map((stat, i) => (
                <div className="stat" key={stat.label}>
                  <div className="stat-number" ref={(el) => (statRefs.current[i] = el)}>0</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
