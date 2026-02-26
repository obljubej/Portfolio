# Joshua Portfolio — Interactive Origami Crane

An interactive 3D portfolio built with React, TypeScript, Three.js, and React Three Fiber.

The site uses an origami crane as the main navigation model:
- Click a crane section to open its content panel
- Drag the crane to move it in 3D space
- Wings react with velocity-based flapping
- Japanese + English section hints are shown in the scene

## Live Structure

Main app entry points:
- [`src/main.tsx`](src/main.tsx)
- [`src/App.tsx`](src/App.tsx)

3D scene and crane logic:
- [`src/components/Scene.tsx`](src/components/Scene.tsx)
- [`src/crane/CraneMesh.tsx`](src/crane/CraneMesh.tsx)
- [`src/crane/useCraneStore.ts`](src/crane/useCraneStore.ts)

Content panels:
- [`src/components/ContentPanel.tsx`](src/components/ContentPanel.tsx)
- [`src/panels/ProjectsPanel.tsx`](src/panels/ProjectsPanel.tsx)
- [`src/panels/ExperiencePanel.tsx`](src/panels/ExperiencePanel.tsx)
- [`src/panels/SkillsPanel.tsx`](src/panels/SkillsPanel.tsx)
- [`src/panels/ResumePanel.tsx`](src/panels/ResumePanel.tsx)
- [`src/panels/PersonalPanel.tsx`](src/panels/PersonalPanel.tsx)

Editable data:
- [`src/data/projects.ts`](src/data/projects.ts)
- [`src/data/experience.ts`](src/data/experience.ts)
- [`src/data/skills.ts`](src/data/skills.ts)
- [`src/data/personal.ts`](src/data/personal.ts)

## Section Mapping

Crane section to panel mapping (see [`PanelContent`](src/components/ContentPanel.tsx:13)):
- Left Wing → Experience
- Right Wing → Projects
- Body → Skills
- Tail → Personal
- Head → Resume

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Three.js
- React Three Fiber + Drei
- GSAP
- Zustand
- Tailwind CSS

Dependency source: [`package.json`](package.json)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run locally

```bash
npm run dev
```

Then open the local URL shown in terminal (usually `http://localhost:5173`).

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Scripts

Defined in [`package.json`](package.json:6):
- `npm run dev` — start Vite dev server
- `npm run build` — type-check + build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Assets

Static public assets are in [`public/`](public/):
- [`public/crane.stl`](public/crane.stl)
- [`public/crane-icon.svg`](public/crane-icon.svg)
- [`public/resume.pdf`](public/resume.pdf)

## Notes

- Theme toggle is hidden while a section panel is open (intentional UX).
- Portfolio content is data-driven; update the files in [`src/data/`](src/data/) to change projects, experience, skills, and personal links.
- Architecture notes are documented in [`plans/architecture.md`](plans/architecture.md).
