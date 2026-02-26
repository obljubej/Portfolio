# Portfolio Architecture

## Overview

An interactive 3D origami crane portfolio built with React + React Three Fiber + GSAP.
The crane acts as the primary navigation — each section of the crane unfolds to reveal content.

---

## Navigation Mapping

| Crane Section | Content       | Interaction         |
|---------------|---------------|---------------------|
| Left Wing     | Projects      | Click to unfold     |
| Right Wing    | Experience    | Click to unfold     |
| Body          | Skills        | Click to unfold     |
| Tail          | Resume        | Click to unfold     |
| Head          | Personal      | Click to unfold     |

---

## Component Tree

```
App
├── LoadingScreen          (animated crane stroke preloader)
└── AppShell
    ├── Scene              (R3F Canvas)
    │   ├── Lighting       (ambient + directional + point)
    │   ├── CameraRig      (OrbitControls with auto-rotate)
    │   ├── ContactShadows
    │   ├── Environment    (studio preset)
    │   └── CraneMesh      (segmented rigid panels)
    │       ├── PanelMesh × N  (per panel: geometry + material + events)
    │       └── crease lines   (cylinder meshes at hinge positions)
    ├── NavigationHints    (HTML overlay: JP + EN labels per section)
    ├── ContentPanel       (sliding right-side panel)
    │   ├── ProjectsPanel  (lazy)
    │   ├── ExperiencePanel (lazy)
    │   ├── SkillsPanel    (lazy)
    │   ├── ResumePanel    (lazy)
    │   └── PersonalPanel  (lazy)
    └── MobileGestureHandler (swipe-to-close, mobile hints)
```

---

## Data Flow

```
User click on crane panel
  → CraneMesh.PanelMesh onClick
  → useCraneStore.setActiveSection(section)
  → CraneMesh useEffect → useFoldAnimation.unfold(section)
      → GSAP animates THREE.Group rotation per panel
  → ContentPanel useEffect → GSAP slides panel in
  → NavigationHints reacts to activeSection
```

---

## State Management (Zustand — `useCraneStore`)

| State field      | Type                    | Purpose                              |
|------------------|-------------------------|--------------------------------------|
| `activeSection`  | `CraneSection \| null`  | Which section is currently open      |
| `hoveredSection` | `CraneSection \| null`  | Which section the pointer is over    |
| `sectionStates`  | `Record<string, ...>`   | Per-section fold progress + state    |
| `introComplete`  | `boolean`               | Whether intro animation has finished |
| `panelVisible`   | `boolean`               | Whether the content panel is shown   |

---

## Crane Geometry (`craneGeometry.ts`)

The crane is built from **segmented rigid panels** — flat polygon meshes connected at hinge pivots.

Each `PanelDef` specifies:
- `vertices` — polygon corners in local space
- `hingePosition` — world-space pivot point
- `hingeAxis` — axis of rotation (X, Y, or Z)
- `foldedAngle` / `unfoldedAngle` — GSAP target rotations

Panels are grouped by `CraneSection`. When a section is activated, GSAP animates each panel's hinge rotation from `foldedAngle` → `unfoldedAngle` with staggered timing.

---

## Fold Animation (`useFoldAnimation.ts`)

Three animation modes:
1. **`playIntro()`** — all panels animate from flat (0°) to their folded angles on load
2. **`unfold(section)`** — panels in the section rotate to `unfoldedAngle`
3. **`refold(section)`** — panels return to `foldedAngle` (reverse order, faster)

GSAP timelines are killed and replaced on each call to prevent conflicts.

---

## Extension Guide

### Adding a new project
Edit [`src/data/projects.ts`](../src/data/projects.ts):
```ts
{
  id: 'my-project',
  title: 'My Project',
  description: 'Short description.',
  tags: ['React', 'TypeScript'],
  githubUrl: 'https://github.com/...',
  year: 2025,
  featured: true,
}
```

### Adding experience
Edit [`src/data/experience.ts`](../src/data/experience.ts) — add an `ExperienceItem` to the array.

### Adding origami works
Edit [`src/data/personal.ts`](../src/data/personal.ts) — add an `OrigamiWork` to `origamiWorks`.

### Adding a new crane section
1. Add a new key to `CraneSection` in [`src/crane/types.ts`](../src/crane/types.ts)
2. Add panel definitions to `PANEL_DEFS` in [`src/crane/craneGeometry.ts`](../src/crane/craneGeometry.ts)
3. Add a hint position to `SECTION_HINT_POSITIONS`
4. Add a case to `PanelContent` in [`src/components/ContentPanel.tsx`](../src/components/ContentPanel.tsx)
5. Create the new panel component in `src/panels/`

### Replacing the paper texture
Drop a new `paper-texture.png` into `portfolio/public/` and it will be picked up by the `.paper-texture` CSS class.

---

## Tech Stack

| Tool                  | Version | Purpose                          |
|-----------------------|---------|----------------------------------|
| React                 | 19      | UI framework                     |
| React Three Fiber     | 9       | React renderer for Three.js      |
| @react-three/drei     | 10      | R3F helpers (OrbitControls, etc) |
| Three.js              | 0.169   | 3D engine                        |
| GSAP                  | 3       | Animation timelines              |
| Zustand               | 5       | Global state                     |
| Tailwind CSS          | 3       | Utility-first styling            |
| Vite                  | 6       | Build tool                       |
| TypeScript            | 5       | Type safety                      |

---

## Performance Notes

- All panel components are **lazy-loaded** via `React.lazy` + `Suspense`
- Three.js geometries are **memoized** with `useMemo`
- GSAP timelines are **killed** before creating new ones
- `OrbitControls` uses `enableDamping` for smooth 60fps feel
- `touch-action: none` on canvas prevents scroll interference on mobile
- `ContactShadows` uses a low-res baked shadow (not real-time) for performance
