export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string; // e.g. "Sep 2023"
  endDate: string;   // e.g. "Apr 2024" | "Present"
  description: string[];
  tags?: string[];
  url?: string;
}

export const experience: ExperienceItem[] = [
  {
    id: 'exp-amd-incoming',
    role: 'Silicon Design Engineer Intern (Incoming)',
    company: 'AMD',
    location: 'Markham, ON',
    startDate: 'May 2026',
    endDate: 'Present',
    description: [],
    tags: [],
  },
  {
    id: 'exp-bell-2025',
    role: 'Software Developer Intern',
    company: 'Bell Canada',
    location: 'Toronto, ON',
    startDate: 'Summer 2025',
    endDate: 'Summer 2025',
    description: [
      'Automated upgrade and rollback workflows for Nokia, Juniper, and Cisco routers using Python, Pydantic, Jinja2, Kubernetes, and Conductor.',
      'Built reusable configuration packages across SR-OS, JUNOS, and IOS to accelerate deployment and reduce operational risk.',
      'Refactored inventory services with a factory-pattern architecture to streamline onboarding of new router families.',
      'Containerized internal microservices with Docker/Podman for consistent environments across development, staging, and production.',
      'Collaborated with developers and network engineers to validate and deploy changes in live environments.',
    ],
    tags: ['Python', 'Kubernetes', 'Docker', 'Conductor', 'Networking'],
  },
  {
    id: 'exp-bell-2024',
    role: 'Software Developer Intern',
    company: 'Bell Canada',
    location: 'Toronto, ON',
    startDate: 'Summer 2024',
    endDate: 'Summer 2024',
    description: [
      'Developed a full-stack internal analytics application using Spring Boot, Java, SQL, Vue.js, and Tailwind CSS.',
      'Refactored a customer-node correlation tool, reducing processing time by 75%.',
      'Improved compatibility for legacy/backlog workflows while enhancing Java debugging and maintainability.',
      'Supported migration of legacy services from Java 8 to Java 11 for better performance and platform compatibility.',
    ],
    tags: ['Java', 'Spring Boot', 'SQL', 'Vue.js', 'Tailwind CSS'],
  },
  {
    id: 'exp-madrt',
    role: 'Embedded Systems Developer',
    company: 'McMaster Aerial Drone & Robotics Team',
    location: 'Hamilton, ON',
    startDate: 'Jun 2025',
    endDate: 'Present',
    description: [
      'Designed a custom 6S Li-Po battery monitoring subsystem for real-time voltage/current visibility and safer operation.',
      'Developed a power distribution board with fuse protection and trace sizing for high-current ESC loads.',
      'Contributed to STM32F745VGT6 flight-controller hardware design (Altium PCB layout) and embedded C firmware.',
      'Extending the platform toward autonomous flight with SLAM and PyTorch-based vision pipelines.',
    ],
    tags: ['Embedded C', 'STM32', 'Altium', 'PCB Design', 'SLAM'],
  },
  {
    id: 'exp-solar-car',
    role: 'Solar Cells & Data Acquisition',
    company: 'McMaster Solar Car Team',
    location: 'Hamilton, ON',
    startDate: 'Fall 2024',
    endDate: 'Present',
    description: [
      'Designing a Maximum Power Point Tracker (MPPT) for the 9th-generation solar car, targeting efficient high-voltage array integration.',
      'Designed solar-cell bypass diode and wiring configurations for reliable array-to-vehicle electrical integration.',
      'Built a custom current-sensing solution for solar cells and MPPT telemetry to support real-time power monitoring.',
    ],
    tags: ['MPPT', 'Solar', 'DAQ', 'Hardware Design'],
  },
  {
    id: 'exp-steam-project',
    role: 'Summer Camp Counselor',
    company: 'The STEAM Project',
    location: 'Richmond Hill, ON',
    startDate: 'Summer 2022',
    endDate: 'Summer 2022',
    description: [
      'Coached children aged 4–12 through hands-on STEAM activities, promoting creativity, confidence, and teamwork.',
      'Designed and delivered origami-focused lesson plans to build communication and problem-solving skills.',
      'Worked closely with staff to maintain a safe, structured, and engaging camp environment.',
    ],
    tags: ['Teaching', 'Leadership', 'Mentorship'],
  },
  {
    id: 'exp-origami-canada',
    role: 'Senior Instructor / Executive Team',
    company: 'Origami Canada / Origami Society of Toronto',
    location: 'Toronto, ON',
    startDate: '2018',
    endDate: 'Present',
    description: [
      'Taught 100+ students across workshops, events, and conferences, adapting instruction for all ages and skill levels.',
      'Led community outreach sessions for seniors focused on dexterity, creativity, and social engagement.',
      'Received recognition including the Richmond Hill Community Volunteer Award and Origami Canada Senior Instructor award.',
    ],
    tags: ['Instruction', 'Community Outreach', 'Public Speaking'],
  },
];
