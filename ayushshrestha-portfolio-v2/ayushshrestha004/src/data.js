// ─── Projects ────────────────────────────────────────────────────────────
// Order = display order. `featured: true` gets the larger card treatment.
export const projects = [
  {
    title: 'Scholastic Exchange',
    tag: 'Fullstack',
    status: 'building',
    description:
      'A full-stack marketplace for skill-sharing, micro-gigs, and peer-to-peer learning — user profiles, gig listings, real-time messaging, and a role-based admin console with tier overrides and soft-delete moderation.',
    stack: 'Node.js + Express (ESM) · PostgreSQL · Socket.IO · JWT auth',
    tech: ['React', 'Vite', 'Express', 'PostgreSQL', 'Socket.IO', 'JWT'],
    featured: true,
  },
  {
    title: 'CampusEats',
    tag: 'Fullstack',
    status: 'building',
    description:
      'A campus food ordering platform with separate student, canteen, and admin dashboards, live order tracking, and analytics charts for canteen sales.',
    stack: 'React + Tailwind · Express · PostgreSQL · Docker Compose',
    tech: ['React', 'Tailwind', 'Express', 'PostgreSQL', 'Chart.js', 'Docker'],
    github: 'https://github.com/IsthatAyus/campuseatspern',
    featured: true,
  },
  {
    title: 'AttendancePro',
    tag: 'Fullstack',
    status: 'building',
    description:
      'A full-stack attendance tracking system built for a university professor — employee CRUD with image uploads, attendance status tracking, PDF report generation, and a dirty-state sticky save bar.',
    stack: 'React + Tailwind v4 · Express (ESM) · PostgreSQL · Docker Compose',
    tech: ['React', 'Vite', 'Tailwind', 'Express', 'PostgreSQL', 'Docker'],
    featured: true,
  },
  {
    title: 'Hosting Automation Platform',
    tag: 'DevOps',
    status: 'shipped',
    description:
      'An integrated hosting platform using FOSSBilling and ISPConfig with automated provisioning, email notifications, and client management — cut manual setup time by 80%.',
    stack: 'Bare-metal VPS · Apache · MySQL · ISPConfig automation hooks',
    tech: ['PHP', 'ISPConfig', 'MySQL', 'Apache', 'FOSSBilling'],
    featured: false,
  },
  {
    title: 'Edulink',
    tag: 'Frontend',
    status: 'shipped',
    description:
      'A collaborative platform for college students to connect and share academic resources — resource sharing, discussion forums, and event notifications.',
    stack: 'Netlify · GitHub Actions CI · CDN-backed assets',
    tech: ['HTML', 'CSS', 'JavaScript', 'Netlify'],
    github: 'https://github.com/IsthatAyus/Edulink',
    live: 'https://edulinkk.netlify.app/',
    featured: false,
  },
  {
    title: 'Starlight Collector',
    tag: 'Game',
    status: 'shipped',
    description:
      'A 2D game built with Java Swing to learn MVC architecture and OOP design patterns — dynamic gameplay loops and smooth frame-based animation.',
    stack: 'Cross-platform JAR · GitHub Releases',
    tech: ['Java', 'Swing', 'MVC', 'OOP'],
    github: 'https://github.com/PritamTheCoder/Starlight_Collector',
    featured: false,
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────
export const skillGroups = [
  { icon: '☁️', category: 'Cloud', items: ['AWS', 'GCP', 'DigitalOcean'] },
  { icon: '📦', category: 'Containers', items: ['Docker', 'Kubernetes', 'Helm'] },
  { icon: '⚙️', category: 'CI / CD', items: ['GitHub Actions', 'Jenkins', 'ArgoCD'] },
  { icon: '🏗️', category: 'Infrastructure as Code', items: ['Terraform', 'Ansible', 'Pulumi'] },
  { icon: '📊', category: 'Monitoring', items: ['Prometheus', 'Grafana', 'Loki'] },
  { icon: '⚛️', category: 'Frontend', items: ['React', 'Vite', 'Tailwind'] },
  { icon: '🗄️', category: 'Backend & Data', items: ['Node.js', 'Express', 'PostgreSQL'] },
  { icon: '🔀', category: 'Version Control', items: ['Git', 'GitHub', 'GitLab'] },
];

// ─── Nav / pipeline sections ─────────────────────────────────────────────
export const navItems = ['about', 'experience', 'projects', 'skills', 'contact'];
