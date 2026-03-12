export interface OrigamiWork {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  year: number;
  tags?: string[];
  url?: string;
}

const ORIGAMI_BASE = `${import.meta.env.BASE_URL}origami/`;

export const origamiWorks: OrigamiWork[] = [
  {
    id: 'featured-fold',
    title: 'Hell Cobra',
    imageUrl: `${ORIGAMI_BASE}626688103_17970350330990927_4130127568483694639_n..jpg`,
    year: 2026,
    tags: ['Origami', 'Featured'],
    url: 'https://www.instagram.com/obl.origami/',
  },
  {
    id: 'modular-wings-series',
    title: 'K2',
    images: [
      `${ORIGAMI_BASE}502303430_17845487457494453_2947269727993315256_n..jpg`,
      `${ORIGAMI_BASE}502383910_17845487436494453_5671963415699202700_n..jpg`,
      `${ORIGAMI_BASE}502720295_17845487454494453_4466283332834758344_n..jpg`,
      `${ORIGAMI_BASE}502974718_17845487439494453_1302006477231808412_n..jpg`,
    ],
    year: 2026,
    tags: ['Origami', 'Model Study'],
    url: 'https://www.instagram.com/obl.origami/',
  },
  {
    id: 'crease-sculpt-study-a',
    title: 'Wild Boar',
    images: [
      `${ORIGAMI_BASE}502375554_17845485216494453_5354242527203797110_n..jpg`,
      `${ORIGAMI_BASE}503317836_17845485219494453_7734815762222086406_n..jpg`,
    ],
    year: 2026,
    tags: ['Origami', 'Form Exploration'],
    url: 'https://www.instagram.com/obl.origami/',
  },
  {
    id: 'crease-sculpt-study-b',
    title: 'Ant',
    images: [
      `${ORIGAMI_BASE}502756603_17845485972494453_8137298336478439060_n..jpg`,
      `${ORIGAMI_BASE}502988776_17845485969494453_1275235674367896360_n..jpg`,
    ],
    year: 2026,
    tags: ['Origami', 'Precision Folding'],
    url: 'https://www.instagram.com/obl.origami/',
  },
  {
    id: 'dramatic-fold-series',
    title: 'Tessellations',
    images: [
      `${ORIGAMI_BASE}502750704_17845488885494453_2247129714904614431_n..jpg`,
      `${ORIGAMI_BASE}502993094_17845488846494453_6940426352256125703_n..jpg`,
      `${ORIGAMI_BASE}503022519_17845488882494453_6927950585628009365_n..jpg`,
    ],
    year: 2026,
    tags: ['Origami', 'Presentation'],
    url: 'https://www.instagram.com/obl.origami/',
  },
  {
    id: 'structural-balance-series',
    title: 'Greater Kudu',
    images: [
      `${ORIGAMI_BASE}503316318_17845492089494453_7057643614854809461_n..jpg`,
      `${ORIGAMI_BASE}503398355_17845492092494453_8262786312948499871_n..jpg`,
    ],
    year: 2026,
    tags: ['Origami', 'Model Study'],
    url: 'https://www.instagram.com/obl.origami/',
  },
];
