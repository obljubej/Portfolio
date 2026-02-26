export interface OrigamiWork {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  year: number;
  tags?: string[];
  url?: string;
}

export interface PersonalInfo {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email?: string;
  github?: string;
  linkedin?: string;
  devpost?: string;
}

export const personalInfo: PersonalInfo = {
  name: 'Joshua',
  tagline: 'Software developer & origami enthusiast',
  bio: 'I build things at the intersection of code and craft — from GPU-accelerated physics simulations to interactive web experiences. When I\'m not writing software, I\'m folding paper.',
  location: 'Toronto, ON',
  github: 'https://github.com/obljubej',
  devpost: 'https://devpost.com/obljubej',
};

export const origamiWorks: OrigamiWork[] = [
  // ── Add origami works here ──────────────────────────────────────────────────
  // {
  //   id: 'crane-series',
  //   title: 'Crane Series',
  //   description: 'A series of modular origami cranes exploring symmetry and recursion.',
  //   year: 2024,
  //   tags: ['Modular', 'Crane', 'Symmetry'],
  // },
];
