import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Stages mirror a CI/CD pipeline — the same shape as the terminal
// commands in the hero, just expressed as the page's own scroll spine.
const STAGES = [
  { id: 'about', label: 'build' },
  { id: 'projects', label: 'test' },
  { id: 'skills', label: 'stage' },
  { id: 'contact', label: 'deploy' },
];

export default function PipelineTrail() {
  const railRef = useRef(null);
  const fillRef = useRef(null);
  const signalRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    const signal = signalRef.current;
    if (!rail || !fill) return;

    const ctx = gsap.context(() => {
      // Fill draws downward as the whole document scrolls.
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        }
      );

      // A signal dot rides the leading edge of the fill — the "deploy
      // in progress" indicator, not just a static bar.
      if (signal) {
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            gsap.set(signal, { top: `${self.progress * 100}%` });
          },
        });
        gsap.to(signal, {
          scale: 1.35,
          duration: 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // Each node "goes green" as its section becomes active.
      STAGES.forEach((stage, i) => {
        const el = document.getElementById(stage.id);
        const node = nodeRefs.current[i];
        if (!el || !node) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => node.classList.add('trail-node-active'),
          onEnterBack: () => node.classList.add('trail-node-active'),
          onLeave: () => node.classList.remove('trail-node-active'),
          onLeaveBack: () => node.classList.remove('trail-node-active'),
        });
      });
    }, rail);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pipeline-trail" ref={railRef} aria-hidden="true">
      <div className="trail-rail">
        <div className="trail-fill" ref={fillRef} />
      </div>
      <div className="trail-signal" ref={signalRef} />
      <div className="trail-nodes">
        {STAGES.map((stage, i) => (
          <div
            key={stage.id}
            className="trail-node"
            ref={(el) => (nodeRefs.current[i] = el)}
            style={{ top: `${(i / (STAGES.length - 1)) * 100}%` }}
          >
            <span className="trail-dot" />
            <span className="trail-label">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}