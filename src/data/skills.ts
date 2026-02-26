export interface SkillGroup {
  category: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C', 'SQL'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'React Three Fiber', 'Three.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'GSAP'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'MongoDB'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Vite', 'Docker', 'Figma', 'VS Code'],
  },
  {
    category: 'Graphics & Simulation',
    skills: ['WebGL', 'GLSL Shaders', 'Three.js', 'Physics Simulation', 'Origami Geometry'],
  },
  // ── Add / edit categories here ──────────────────────────────────────────────
];
