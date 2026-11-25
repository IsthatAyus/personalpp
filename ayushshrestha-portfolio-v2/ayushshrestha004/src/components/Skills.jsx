import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillGroups } from '../data';

gsap.registerPlugin(ScrollTrigger);

function SkillGroup({ icon, category, items }) {
  return (
    <div className="skill-group">
      <div className="skill-group-header">
        <span className="skill-group-icon">{icon}</span>
        <span className="skill-group-category">{category}</span>
      </div>
      <div className="skill-tags">
        {items.map((item) => (
          <span key={item} className="skill-pill">{item}</span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-group', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' },
      });
      gsap.from('.skills-note', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: { trigger: '.skills-note', start: 'top 90%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="section skills-section" ref={rootRef}>
      <div className="section-content">
        <div className="section-label">
          <span className="label-number">03</span>
          <span className="label-text">Skills</span>
        </div>
        <h2 className="section-title">Tech Stack &amp; Expertise</h2>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <SkillGroup key={group.category} {...group} />
          ))}
        </div>

        <div className="skills-note">
          <p>
            Currently expanding expertise in{' '}
            <strong>Kubernetes orchestration</strong> and{' '}
            <strong>cloud-native architectures</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
