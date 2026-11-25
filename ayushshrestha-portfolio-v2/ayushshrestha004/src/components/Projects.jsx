import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(card, {
      rotateX: (y / rect.height - 0.5) * -6,
      rotateY: (x / rect.width - 0.5) * 6,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
  };

  return (
    <div
      className={`project-card ${project.featured ? 'featured' : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-progress" />
      <div className="project-card-inner">
        <div className="project-header">
          <div className="project-meta">
            <span className="project-number">0{index + 1}</span>
            <span className={`project-badge badge-${project.status}`}>
              {project.tag}
            </span>
          </div>
          <div className="project-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>Source</span>
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link project-link-live" aria-label="Live Demo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                <span>Live</span>
              </a>
            )}
          </div>
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {project.stack && (
          <div className="project-deploy">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>{project.stack}</span>
          </div>
        )}

        <div className="project-tech">
          {project.tech.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.project-card');

      cards.forEach((card, i) => {
        const bar = card.querySelector('.project-progress');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 85%' },
          delay: i * 0.08,
        });

        // Card "deploys" into place — clip-reveal from the bottom,
        // not a plain opacity fade.
        tl.fromTo(
          card,
          { clipPath: 'inset(100% 0 0 0)', y: 36 },
          { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 0.7, ease: 'power4.out' }
        );

        // Then a build-progress bar sweeps across the top and clears —
        // a small "step complete" flourish before settling.
        if (bar) {
          tl.fromTo(
            bar,
            { scaleX: 0, opacity: 1 },
            { scaleX: 1, duration: 0.35, ease: 'power2.out', transformOrigin: 'left' },
            '-=0.15'
          ).to(bar, { opacity: 0, duration: 0.3 }, '+=0.05');
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="section projects-section" ref={rootRef}>
      <div className="section-content">
        <div className="section-label">
          <span className="label-number">03</span>
          <span className="label-text">Projects</span>
        </div>
        <h2 className="section-title">Featured Work</h2>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <div className="projects-footer">
          <a
            href="https://github.com/IsthatAyus"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View all on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}