export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  url?: string;
  devpostUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  year: number;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'origami-simulator',
    title: 'Origami Simulator',
    description: 'GPU-accelerated origami physics simulator using WebGL shaders. Fold any crease pattern in real time.',
    longDescription:
      'A browser-based origami physics simulator that uses GPU fragment shaders to compute vertex positions, velocities, and fold angles in parallel. Supports dynamic, static, and rigid folding modes with adjustable stiffness parameters.',
    tags: ['Three.js', 'WebGL', 'GLSL', 'Physics Simulation', 'JavaScript'],
    url: 'https://origamisimulator.org',
    year: 2024,
    featured: true,
  },
  {
    id: 'devpost-projects',
    title: 'Hackathon Projects',
    description: 'A collection of hackathon projects built under time pressure — spanning AI, hardware, and web.',
    tags: ['Hackathon', 'Various'],
    devpostUrl: 'https://devpost.com/obljubej',
    year: 2024,
    featured: true,
  },
  // ── Add more projects here ──────────────────────────────────────────────────
  // {
  //   id: 'my-project',
  //   title: 'My Project',
  //   description: 'Short description.',
  //   tags: ['React', 'TypeScript'],
  //   githubUrl: 'https://github.com/...',
  //   year: 2025,
  // },
];
