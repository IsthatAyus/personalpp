import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HIGHLIGHTS = [
  'Designed and deployed a monitoring stack with Prometheus, Grafana, cAdvisor, and node-exporter across two production servers, with centralized scraping and five automated Grafana email alert rules.',
  'Supported CI/CD pipeline monitoring and routine deployments, coordinating with development teams for smooth, low-downtime releases.',
  'Assisted with Linux server setup, configuration, maintenance, backups, and system performance monitoring.',
  'Diagnosed and resolved networking issues, including a rogue DHCP server caused by a misconfigured sub-router; restored connectivity and documented the fix.',
  'Created internal DevOps and monitoring documentation, and contributed to basic automation and version management.',
];

export default function Experience() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.experience-entry', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section experience-section" ref={rootRef}>
      <div className="section-content">
        <div className="section-label">
          <span className="label-number">02</span>
          <span className="label-text">Experience</span>
        </div>
        <h2 className="section-title">Professional Experience</h2>

        <div className="experience-timeline">
          <article className="experience-entry">
            <header className="experience-header">
              <div>
                <h3 className="experience-role">DevOps Intern</h3>
                <p className="experience-company">Smart Solutions Technology Pvt. Ltd.</p>
              </div>
              <div className="experience-meta">
                <span>Oct 2025 – May 2026</span>
                <span>Kathmandu, Nepal · Paid from Feb 2026</span>
              </div>
            </header>

            <ul className="experience-highlights">
              {HIGHLIGHTS.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
