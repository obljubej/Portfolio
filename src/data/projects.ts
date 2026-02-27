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
}

export const projects: Project[] = [
  {
    id: 'origami-reference-finder',
    title: 'Origami Reference Finder',
    description:
      'Generates minimal fold sequences to locate arbitrary reference points on a sheet of paper.',
    longDescription:
      'Building a geometric constraint engine that computes fold constructions to approximate any target coordinate (x, y) on a square sheet. The system supports tolerance bounds (e.g., ±0.5%) and “don’t-care” axes to reduce fold complexity. The goal is to minimize the number of folds required while maintaining spatial accuracy, forming a foundation for computational origami tooling and automated crease-sequence synthesis.',
    tags: ['Python', 'Computational Geometry', 'Optimization', 'Algorithms', 'Origami'],
    githubUrl: 'https://github.com/obljubej/Origami-Reference-Finder',
    year: 2026,
  },
  {
    id: 'nova-mk-i',
    title: 'Nova MK-I (Bluetooth Split Keyboard, In Progress)',
    description:
      'Custom wireless split mechanical keyboard currently in progress, designed from schematic to firmware.',
    longDescription:
      'Designing and laying out a low-power split keyboard with integrated battery charging, USB-C, and BLE connectivity. The project focuses on PCB signal integrity, power optimization, and modular expansion. Firmware development includes matrix scanning, wireless stack configuration, and custom layout logic, with emphasis on reliability and low-latency input over Bluetooth.',
    tags: ['Embedded Systems', 'BLE', 'KiCad', 'PCB Design', 'Firmware'],
    githubUrl: 'https://github.com/obljubej/Nova-MK-I',
    year: 2025,
  },
  {
    id: 'paul-keyboard',
    title: 'PAUL 3x6.3 USB-C Keyboard',
    description:
      'Reversible 42-key split keyboard built from scratch.',
    longDescription:
      'Designed and fabricated a fully reversible 3x6.3 PCB including diode matrix routing, TRRS interconnect, OLED integration, and USB-C support. The board was laid out in KiCad and assembled by hand, followed by firmware implementation for layer logic, matrix scanning, and display control. The project emphasized compact routing, manufacturability, and clean electrical design.',
    tags: ['Keyboard', 'Embedded C', 'KiCad', 'Hardware Design'],
    githubUrl: 'https://github.com/obljubej/PAUL-3x6_3-USB-C-Keyboard-',
    year: 2025,
  },
  {
    id: 'live-sight',
    title: 'LiveSight',
    description:
      'Smart safety glasses with integrated sensors and AI-assisted voice control.',
    longDescription:
      'Prototyped a wearable smartglasses system featuring heart-rate and temperature sensing, peripheral flip-down display mechanics, and hands-free voice interaction. Designed the mechanical hinge and display system, integrated microcontrollers and SBCs, and implemented real-time serial communication between hardware and AI services. Built for safety-aware monitoring and contextual feedback in maker environments.',
    tags: ['Embedded Systems', 'Wearables', 'AI', 'Rapid Prototyping'],
    devpostUrl: 'https://devpost.com/obljubej',
    year: 2025,
  },
  {
    id: 'ink-keys',
    title: 'Ink-Keys',
    description:
      'Vision-based piano playable on drawn or printed keyboards.',
    longDescription:
      'Developed a computer vision pipeline to detect hand landmarks and map finger positions onto drawn or printed keyboard layouts. Implemented low-latency interaction between a vision backend and a responsive frontend interface. Designed to explore accessible, hardware-light musical interaction through image processing and real-time gesture tracking.',
    tags: ['Computer Vision', 'Real-Time Systems', 'Web Integration'],
    devpostUrl: 'https://devpost.com/obljubej',
    year: 2025,
  },
  {
    id: 'devpost-profile',
    title: 'Devpost Portfolio',
    description:
      'Collection of hackathon builds across embedded systems, AI, and human-computer interaction.',
    tags: ['Hackathons', 'Embedded Systems', 'AI', 'HCI'],
    devpostUrl: 'https://devpost.com/obljubej',
    year: 2026,
  },
];
