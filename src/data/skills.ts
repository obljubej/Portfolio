export interface SkillGroup {
  category: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: [
      'Python',
      'C/C++',
      'Java',
      'TypeScript',
      'JavaScript',
      'SQL',
      'Bash',
      'Verilog',
      'SystemVerilog',
      'TCL',
    ],
  },
  {
    category: 'Frontend',
    skills: ['React', 'React Three Fiber', 'Three.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Vue'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'REST APIs', 'Spring Boot', 'Flask', 'MongoDB', 'Redis'],
  },
  {
    category: 'Embedded & Hardware',
    skills: [
      'STM32 (ARM Cortex-M)',
      'FPGA',
      'Raspberry Pi',
      'Arduino',
      'QMK',
      'PCB Design',
      'Power Distribution Boards',
      'Battery Management',
    ],
  },
  {
    category: 'Chip Design & EDA',
    skills: ['UVM', 'Silicon Verification', 'Altium', 'KiCad'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Linux', 'Git', 'GitHub', 'Docker', 'Kubernetes', 'Vite', 'VS Code'],
  },
  {
    category: 'Graphics & Simulation',
    skills: ['WebGL', 'GLSL Shaders', 'Three.js', 'OpenCV', 'PyTorch', 'Physics Simulation', 'Origami Geometry'],
  },
];
