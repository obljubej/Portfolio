import * as THREE from 'three';
import { CraneSection } from './types';

// ─── Panel definition ─────────────────────────────────────────────────────────
// Each panel is a flat polygon defined in LOCAL space (before hinge rotation).
// The hinge pivot is the point around which the panel rotates when unfolding.
// hingeAxis is the axis of rotation in the PARENT group's local space.
// foldedAngle  = rotation when crane is fully folded (resting pose)
// unfoldedAngle = rotation when this section is fully opened

export interface PanelDef {
  id: string;
  section: CraneSection;
  // Vertices of the flat polygon in local space (y-up, centered at hinge)
  vertices: [number, number, number][];
  // Hinge pivot position in parent space
  hingePosition: [number, number, number];
  // Axis to rotate around (normalized)
  hingeAxis: [number, number, number];
  // Rotation angles (radians)
  foldedAngle: number;
  unfoldedAngle: number;
  // Color tint for this panel (slight variation for paper realism)
  colorTint?: string;
}

// ─── Crane panel definitions ──────────────────────────────────────────────────
// Coordinate system: X = right, Y = up, Z = toward viewer
// The crane body sits at origin, wings extend left/right, head/tail along Z.
//
// Origami crane anatomy (simplified segmented-panel model):
//
//          [HEAD]
//            |
//   [L-WING]─[BODY]─[R-WING]
//            |
//          [TAIL]
//
// Each section has 2–4 panels that hinge open like unfolding paper.

const S = 1.0; // scale unit

export const PANEL_DEFS: PanelDef[] = [
  // ── BODY (center diamond) ──────────────────────────────────────────────────
  {
    id: 'body-top',
    section: CraneSection.Body,
    vertices: [
      [0, 0, 0],
      [-S * 0.6, S * 0.5, 0],
      [0, S * 1.0, 0],
      [S * 0.6, S * 0.5, 0],
    ],
    hingePosition: [0, 0, 0],
    hingeAxis: [1, 0, 0],
    foldedAngle: 0,
    unfoldedAngle: 0,
    colorTint: '#f0ebe3',
  },
  {
    id: 'body-bottom',
    section: CraneSection.Body,
    vertices: [
      [0, 0, 0],
      [S * 0.6, -S * 0.5, 0],
      [0, -S * 1.0, 0],
      [-S * 0.6, -S * 0.5, 0],
    ],
    hingePosition: [0, 0, 0],
    hingeAxis: [1, 0, 0],
    foldedAngle: 0,
    unfoldedAngle: 0,
    colorTint: '#ede8e0',
  },

  // ── LEFT WING (Projects) ───────────────────────────────────────────────────
  {
    id: 'left-wing-upper',
    section: CraneSection.LeftWing,
    vertices: [
      [0, 0, 0],
      [-S * 1.4, S * 0.3, 0],
      [-S * 1.8, 0, 0],
      [-S * 1.4, -S * 0.3, 0],
    ],
    hingePosition: [-S * 0.6, S * 0.5, 0],
    hingeAxis: [0, 1, 0],
    foldedAngle: -Math.PI * 0.15,
    unfoldedAngle: -Math.PI * 0.55,
    colorTint: '#f5f0e8',
  },
  {
    id: 'left-wing-lower',
    section: CraneSection.LeftWing,
    vertices: [
      [0, 0, 0],
      [-S * 1.4, -S * 0.3, 0],
      [-S * 1.8, 0, 0],
      [-S * 1.4, S * 0.3, 0],
    ],
    hingePosition: [-S * 0.6, -S * 0.5, 0],
    hingeAxis: [0, 1, 0],
    foldedAngle: Math.PI * 0.15,
    unfoldedAngle: Math.PI * 0.55,
    colorTint: '#ede8df',
  },

  // ── RIGHT WING (Experience) ────────────────────────────────────────────────
  {
    id: 'right-wing-upper',
    section: CraneSection.RightWing,
    vertices: [
      [0, 0, 0],
      [S * 1.4, S * 0.3, 0],
      [S * 1.8, 0, 0],
      [S * 1.4, -S * 0.3, 0],
    ],
    hingePosition: [S * 0.6, S * 0.5, 0],
    hingeAxis: [0, 1, 0],
    foldedAngle: Math.PI * 0.15,
    unfoldedAngle: Math.PI * 0.55,
    colorTint: '#f5f0e8',
  },
  {
    id: 'right-wing-lower',
    section: CraneSection.RightWing,
    vertices: [
      [0, 0, 0],
      [S * 1.4, -S * 0.3, 0],
      [S * 1.8, 0, 0],
      [S * 1.4, S * 0.3, 0],
    ],
    hingePosition: [S * 0.6, -S * 0.5, 0],
    hingeAxis: [0, 1, 0],
    foldedAngle: -Math.PI * 0.15,
    unfoldedAngle: -Math.PI * 0.55,
    colorTint: '#ede8df',
  },

  // ── TAIL (Resume) ──────────────────────────────────────────────────────────
  {
    id: 'tail-left',
    section: CraneSection.Tail,
    vertices: [
      [0, 0, 0],
      [-S * 0.3, -S * 0.8, 0],
      [0, -S * 1.6, 0],
    ],
    hingePosition: [-S * 0.3, -S * 1.0, 0],
    hingeAxis: [1, 0, 0],
    foldedAngle: Math.PI * 0.1,
    unfoldedAngle: Math.PI * 0.5,
    colorTint: '#f0ebe2',
  },
  {
    id: 'tail-right',
    section: CraneSection.Tail,
    vertices: [
      [0, 0, 0],
      [S * 0.3, -S * 0.8, 0],
      [0, -S * 1.6, 0],
    ],
    hingePosition: [S * 0.3, -S * 1.0, 0],
    hingeAxis: [1, 0, 0],
    foldedAngle: -Math.PI * 0.1,
    unfoldedAngle: -Math.PI * 0.5,
    colorTint: '#ede8df',
  },

  // ── HEAD / NECK (Personal) ─────────────────────────────────────────────────
  {
    id: 'neck',
    section: CraneSection.Head,
    vertices: [
      [0, 0, 0],
      [-S * 0.15, S * 0.6, 0],
      [S * 0.15, S * 0.6, 0],
    ],
    hingePosition: [0, S * 1.0, 0],
    hingeAxis: [1, 0, 0],
    foldedAngle: -Math.PI * 0.2,
    unfoldedAngle: -Math.PI * 0.05,
    colorTint: '#f5f0e8',
  },
  {
    id: 'head-beak',
    section: CraneSection.Head,
    vertices: [
      [0, 0, 0],
      [-S * 0.1, S * 0.35, 0],
      [S * 0.1, S * 0.35, 0],
    ],
    hingePosition: [0, S * 1.6, 0],
    hingeAxis: [1, 0, 0],
    foldedAngle: Math.PI * 0.3,
    unfoldedAngle: Math.PI * 0.05,
    colorTint: '#ede8df',
  },
];

// ─── Group panels by section ──────────────────────────────────────────────────
export function getPanelsBySection(section: CraneSection): PanelDef[] {
  return PANEL_DEFS.filter((p) => p.section === section);
}

// ─── Build a BufferGeometry from panel vertices ───────────────────────────────
export function buildPanelGeometry(vertices: [number, number, number][]): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();

  // Triangulate as a fan from vertex 0
  const positions: number[] = [];
  const normals: number[]   = [];
  const uvs: number[]       = [];

  for (let i = 1; i < vertices.length - 1; i++) {
    const v0 = vertices[0];
    const v1 = vertices[i];
    const v2 = vertices[i + 1];

    // Front face
    positions.push(...v0, ...v1, ...v2);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
    uvs.push(
      (v0[0] + 2) / 4, (v0[1] + 2) / 4,
      (v1[0] + 2) / 4, (v1[1] + 2) / 4,
      (v2[0] + 2) / 4, (v2[1] + 2) / 4,
    );

    // Back face (reversed winding for double-sided)
    positions.push(...v0, ...v2, ...v1);
    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
    uvs.push(
      (v0[0] + 2) / 4, (v0[1] + 2) / 4,
      (v2[0] + 2) / 4, (v2[1] + 2) / 4,
      (v1[0] + 2) / 4, (v1[1] + 2) / 4,
    );
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeBoundingBox();

  return geo;
}

// ─── Navigation hint world positions (where labels float) ─────────────────────
export const SECTION_HINT_POSITIONS: Record<CraneSection, THREE.Vector3> = {
  [CraneSection.LeftWing]:  new THREE.Vector3(-2.4, 0.2, 0.3),
  [CraneSection.RightWing]: new THREE.Vector3(2.4, 0.2, 0.3),
  [CraneSection.Body]:      new THREE.Vector3(0, 0, 0.5),
  [CraneSection.Tail]:      new THREE.Vector3(0, -1.8, 0.3),
  [CraneSection.Head]:      new THREE.Vector3(0, 2.0, 0.3),
};
