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
  // ── Populate from resume ────────────────────────────────────────────────────
  // Example structure — replace with your actual experience:
  {
    id: 'exp-1',
    role: 'Software Developer',
    company: 'Your Company',
    location: 'Toronto, ON',
    startDate: 'Jan 2024',
    endDate: 'Present',
    description: [
      'Built and maintained full-stack web applications.',
      'Collaborated with cross-functional teams to deliver features on schedule.',
    ],
    tags: ['React', 'TypeScript', 'Node.js'],
  },
  // ── Add more entries here ───────────────────────────────────────────────────
];
