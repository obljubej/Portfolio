import { create } from 'zustand';
import { type CraneSection, type FoldState } from './types';

interface SectionState {
  foldState: FoldState;
  foldProgress: number; // 0 = folded, 1 = unfolded
}

interface CraneStore {
  // Which section the user has opened (null = crane is fully folded / home)
  activeSection: CraneSection | null;
  // Which section the pointer is currently over
  hoveredSection: CraneSection | null;
  // Per-section fold state
  sectionStates: Record<string, SectionState>;
  // Whether the intro animation has completed
  introComplete: boolean;
  // Whether a content panel is visible
  panelVisible: boolean;
  // Dark theme toggle
  isDark: boolean;
  // True while the user is dragging the crane itself
  isDraggingCrane: boolean;
  // True when pointer movement happened during a crane drag (used to suppress click)
  didDragCrane: boolean;

  // Actions
  setActiveSection: (section: CraneSection | null) => void;
  setHoveredSection: (section: CraneSection | null) => void;
  setSectionFoldState: (section: CraneSection, state: FoldState) => void;
  setSectionFoldProgress: (section: CraneSection, progress: number) => void;
  setIntroComplete: (complete: boolean) => void;
  setPanelVisible: (visible: boolean) => void;
  closePanel: () => void;
  setTheme: (dark: boolean) => void;
  toggleTheme: () => void;
  setDraggingCrane: (dragging: boolean) => void;
  setDidDragCrane: (didDrag: boolean) => void;
  clearDidDragCrane: () => void;
}

const defaultSectionState = (): SectionState => ({
  foldState: 'folded',
  foldProgress: 0,
});

export const useCraneStore = create<CraneStore>((set) => ({
  activeSection: null,
  hoveredSection: null,
  sectionStates: {},
  introComplete: false,
  panelVisible: false,
  isDark: true,
  isDraggingCrane: false,
  didDragCrane: false,

  setActiveSection: (section) =>
    set({ activeSection: section, panelVisible: section !== null }),

  setHoveredSection: (section) =>
    set({ hoveredSection: section }),

  setSectionFoldState: (section, state) =>
    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [section]: {
          ...(s.sectionStates[section] ?? defaultSectionState()),
          foldState: state,
        },
      },
    })),

  setSectionFoldProgress: (section, progress) =>
    set((s) => ({
      sectionStates: {
        ...s.sectionStates,
        [section]: {
          ...(s.sectionStates[section] ?? defaultSectionState()),
          foldProgress: progress,
        },
      },
    })),

  setIntroComplete: (complete) => set({ introComplete: complete }),

  setPanelVisible: (visible) => set({ panelVisible: visible }),

  closePanel: () =>
    set({ panelVisible: false, activeSection: null }),

  setTheme: (dark) => set({ isDark: dark }),

  toggleTheme: () =>
    set((s) => ({ isDark: !s.isDark })),

  setDraggingCrane: (dragging) => set({ isDraggingCrane: dragging }),

  setDidDragCrane: (didDrag) => set({ didDragCrane: didDrag }),

  clearDidDragCrane: () => set({ didDragCrane: false }),
}));
