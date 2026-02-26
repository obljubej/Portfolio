import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { type CraneSection } from './types';
import { PANEL_DEFS } from './craneGeometry';
import { useCraneStore } from './useCraneStore';

// Map from panelId → THREE.Group ref (registered by CraneMesh)
type PanelGroupMap = Map<string, THREE.Group>;

export function useFoldAnimation(panelGroups: React.RefObject<PanelGroupMap>) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { setSectionFoldState, setSectionFoldProgress } = useCraneStore.getState();

  // ── Unfold a section ────────────────────────────────────────────────────────
  const unfold = useCallback(
    (section: CraneSection, onComplete?: () => void) => {
      if (!panelGroups.current) return;

      // Kill any running timeline for this section
      timelineRef.current?.kill();

      setSectionFoldState(section, 'unfolding');

      const panels = PANEL_DEFS.filter((p) => p.section === section);
      const tl = gsap.timeline({
        onComplete: () => {
          setSectionFoldState(section, 'unfolded');
          onComplete?.();
        },
      });

      panels.forEach((panel, i) => {
        const group = panelGroups.current?.get(panel.id);
        if (!group) return;

        // Determine which rotation axis to animate
        const axis = panel.hingeAxis;
        const prop =
          axis[0] !== 0 ? 'rotation.x' :
          axis[1] !== 0 ? 'rotation.y' :
          'rotation.z';

        tl.to(
          group,
          {
            [prop]: panel.unfoldedAngle,
            duration: 0.8,
            ease: 'power3.inOut',
            onUpdate: () => {
              const progress = (group as THREE.Group & { [k: string]: number })[prop.split('.')[1] as 'x' | 'y' | 'z'];
              const t = Math.abs(
                (progress - panel.foldedAngle) /
                (panel.unfoldedAngle - panel.foldedAngle || 1),
              );
              setSectionFoldProgress(section, Math.min(1, Math.max(0, t)));
            },
          },
          i * 0.06, // stagger panels slightly
        );
      });

      timelineRef.current = tl;
    },
    [panelGroups, setSectionFoldState, setSectionFoldProgress],
  );

  // ── Refold a section ────────────────────────────────────────────────────────
  const refold = useCallback(
    (section: CraneSection, onComplete?: () => void) => {
      if (!panelGroups.current) return;

      timelineRef.current?.kill();

      setSectionFoldState(section, 'refolding');

      const panels = PANEL_DEFS.filter((p) => p.section === section);
      const tl = gsap.timeline({
        onComplete: () => {
          setSectionFoldState(section, 'folded');
          setSectionFoldProgress(section, 0);
          onComplete?.();
        },
      });

      // Refold in reverse order
      [...panels].reverse().forEach((panel, i) => {
        const group = panelGroups.current?.get(panel.id);
        if (!group) return;

        const axis = panel.hingeAxis;
        const prop =
          axis[0] !== 0 ? 'rotation.x' :
          axis[1] !== 0 ? 'rotation.y' :
          'rotation.z';

        tl.to(
          group,
          {
            [prop]: panel.foldedAngle,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          i * 0.05,
        );
      });

      timelineRef.current = tl;
    },
    [panelGroups, setSectionFoldState, setSectionFoldProgress],
  );

  // ── Intro animation (crane assembles from flat) ─────────────────────────────
  const playIntro = useCallback(
    (onComplete?: () => void) => {
      if (!panelGroups.current) return;

      const tl = gsap.timeline({ onComplete });

      PANEL_DEFS.forEach((panel, i) => {
        const group = panelGroups.current?.get(panel.id);
        if (!group) return;

        const axis = panel.hingeAxis;
        const prop =
          axis[0] !== 0 ? 'rotation.x' :
          axis[1] !== 0 ? 'rotation.y' :
          'rotation.z';

        // Start flat (0) → animate to folded angle
        (group as THREE.Group & { [k: string]: number })[prop.split('.')[1] as 'x' | 'y' | 'z'] = 0;

        tl.to(
          group,
          {
            [prop]: panel.foldedAngle,
            duration: 1.2,
            ease: 'elastic.out(1, 0.6)',
          },
          i * 0.08,
        );
      });

      // Fade in the whole crane
      tl.from(
        '.crane-root',
        { opacity: 0, duration: 0.4, ease: 'power2.out' },
        0,
      );

      timelineRef.current = tl;
    },
    [panelGroups],
  );

  return { unfold, refold, playIntro };
}
