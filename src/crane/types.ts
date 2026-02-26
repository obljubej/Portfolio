// ─── Crane section identifiers ────────────────────────────────────────────────
export const CraneSection = {
  LeftWing:  'left-wing',   // → Experience (bottom after remap)
  RightWing: 'right-wing',  // → Projects (top after remap)
  Body:      'body',        // → Skills
  Tail:      'tail',        // → Personal (right)
  Head:      'head',        // → Resume (left)
} as const;

export type CraneSection = typeof CraneSection[keyof typeof CraneSection];

// ─── Navigation mapping ───────────────────────────────────────────────────────
export const SECTION_LABELS: Record<CraneSection, string> = {
  [CraneSection.LeftWing]:  'Experience',
  [CraneSection.RightWing]: 'Projects',
  [CraneSection.Body]:      'Skills',
  [CraneSection.Tail]:      'Personal',
  [CraneSection.Head]:      'Resume',
};

// Japanese labels for navigation hints
export const SECTION_LABELS_JP: Record<CraneSection, string> = {
  [CraneSection.LeftWing]:  '経験',
  [CraneSection.RightWing]: 'プロジェクト',
  [CraneSection.Body]:      'スキル',
  [CraneSection.Tail]:      '個人',
  [CraneSection.Head]:      '履歴書',
};

// Fold state per section
export type FoldState = 'folded' | 'unfolding' | 'unfolded' | 'refolding';

export interface SectionState {
  foldState: FoldState;
  foldProgress: number; // 0 = fully folded, 1 = fully unfolded
}
