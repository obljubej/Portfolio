import { useRef, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { type ThreeEvent } from '@react-three/fiber';
import { CraneSection } from './types';
import { useCraneStore } from './useCraneStore';

// ─── Section colours ──────────────────────────────────────────────────────────
const SECTION_COLORS_LIGHT: Record<CraneSection, string> = {
  [CraneSection.LeftWing]:  '#ede8df',
  [CraneSection.RightWing]: '#e8e2d9',
  [CraneSection.Body]:      '#f0ebe3',
  [CraneSection.Tail]:      '#f5f0e8',
  [CraneSection.Head]:      '#ede8df',
};

const SECTION_COLORS_DARK: Record<CraneSection, string> = {
  [CraneSection.LeftWing]:  '#f6efe4',
  [CraneSection.RightWing]: '#f2e9dc',
  [CraneSection.Body]:      '#fbf5ea',
  [CraneSection.Tail]:      '#eee3d4',
  [CraneSection.Head]:      '#f7efe2',
};

const HOVER_COLOR_LIGHT  = new THREE.Color('#d4b896');
const ACTIVE_COLOR_LIGHT = new THREE.Color('#c8a882');
const HOVER_COLOR_DARK   = new THREE.Color('#d7bb95');
const ACTIVE_COLOR_DARK  = new THREE.Color('#caa47a');
const EMISSIVE_ON_LIGHT  = new THREE.Color('#3a2e22');
const EMISSIVE_ON_DARK   = new THREE.Color('#3a2e22');
const EMISSIVE_OFF       = new THREE.Color(0x000000);

// ─── Classify a triangle's section by its centroid (raw STL coords) ───────────
// Verified from debug screenshot:
//   cy > -25  → LeftWing   (large lower-right wing panel)
//   cy < -40  → RightWing  (upper-left large wing panel;
//                            threshold lowered from -42 to -40 to grab neck faces)
//   cx < -5   → Head       (left beak/tip, blue in debug)
//   cx > 10   → Tail       (right tail tip, red in debug;
//                            threshold raised from 8 to 10 so Body gets more)
//   else      → Body       (central diamond, green in debug)
function classifyFaceRaw(cx: number, cy: number): CraneSection {
  if (cy > -25)  return CraneSection.RightWing; // lower-right wing: cy -22 → 0 (bottom)
  if (cy < -40)  return CraneSection.LeftWing;  // upper-left wing: cy -63 → -40 (top)
  // In the body cluster (cy -40 to -25):
  if (cx < -5)   return CraneSection.Head;      // left beak: cx -24 → -8
  if (cx > 10)   return CraneSection.Tail;      // right tail tip: cx +12 → +17
  return CraneSection.Body;                     // central body
}

// ─── Split geometry into per-section sub-geometries ──────────────────────────
// Classifies in raw STL space, applies center+scale per-vertex.
function splitGeometryBySections(rawGeo: THREE.BufferGeometry): Map<CraneSection, THREE.BufferGeometry> {
  const posAttr  = rawGeo.getAttribute('position') as THREE.BufferAttribute;
  const normAttr = rawGeo.getAttribute('normal') as THREE.BufferAttribute | undefined;

  const buckets = new Map<CraneSection, number[]>();
  Object.values(CraneSection).forEach((s) => buckets.set(s, []));

  const faceCount = posAttr.count / 3;
  for (let f = 0; f < faceCount; f++) {
    const i0 = f * 3, i1 = f * 3 + 1, i2 = f * 3 + 2;
    const cx = (posAttr.getX(i0) + posAttr.getX(i1) + posAttr.getX(i2)) / 3;
    const cy = (posAttr.getY(i0) + posAttr.getY(i1) + posAttr.getY(i2)) / 3;
    buckets.get(classifyFaceRaw(cx, cy))!.push(i0, i1, i2);
  }

  rawGeo.computeBoundingBox();
  const box    = rawGeo.boundingBox!;
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size   = new THREE.Vector3();
  box.getSize(size);
  const scale  = 3.5 / Math.max(size.x, size.y, size.z);

  const result = new Map<CraneSection, THREE.BufferGeometry>();
  buckets.forEach((indices, section) => {
    if (indices.length === 0) return;
    const positions: number[] = [];
    const normals: number[]   = [];
    indices.forEach((i) => {
      positions.push(
        (posAttr.getX(i) - center.x) * scale,
        (posAttr.getY(i) - center.y) * scale,
        (posAttr.getZ(i) - center.z) * scale,
      );
      if (normAttr) normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    if (normals.length > 0) {
      g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    } else {
      g.computeVertexNormals();
    }
    result.set(section, g);
  });
  return result;
}

// ─── Compute the inner Y edge of a wing geometry (edge that meets body) ───────
function getWingHingeY(geo: THREE.BufferGeometry): number {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  let minY = Infinity;
  let maxY = -Infinity;
  let sumY = 0;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    sumY += y;
  }

  // Top section uses its lower edge; bottom section uses its upper edge.
  const meanY = sumY / Math.max(1, pos.count);
  return meanY >= 0 ? minY : maxY;
}

function getWingHingePivot(geo: THREE.BufferGeometry, hingeY: number): THREE.Vector3 {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;

  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const size = new THREE.Vector3();
  box.getSize(size);

  const tol = Math.max(0.01, size.y * 0.04);

  const seamPoints: THREE.Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (Math.abs(y - hingeY) <= tol) {
      seamPoints.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
  }

  if (seamPoints.length > 0) {
    // Keep points closest to body center so pivot stays at wing-body join,
    // not out toward side tips.
    seamPoints.sort((a, b) => (a.x * a.x + a.z * a.z) - (b.x * b.x + b.z * b.z));
    const k = Math.max(6, Math.floor(seamPoints.length * 0.35));

    const pivot = new THREE.Vector3();
    for (let i = 0; i < Math.min(k, seamPoints.length); i++) {
      pivot.add(seamPoints[i]);
    }
    pivot.multiplyScalar(1 / Math.min(k, seamPoints.length));

    // Keep axis anchor on the actual hinge edge in Y.
    pivot.y = hingeY;
    return pivot;
  }

  return new THREE.Vector3(0, hingeY, 0);
}

// ─── Single section mesh ──────────────────────────────────────────────────────
interface SectionMeshProps {
  section: CraneSection;
  geometry: THREE.BufferGeometry;
}

function SectionMesh({ section, geometry }: SectionMeshProps) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  const hoveredSection    = useCraneStore((s) => s.hoveredSection);
  const activeSection     = useCraneStore((s) => s.activeSection);
  const setHoveredSection = useCraneStore((s) => s.setHoveredSection);
  const setActiveSection  = useCraneStore((s) => s.setActiveSection);
  const didDragCrane      = useCraneStore((s) => s.didDragCrane);
  const clearDidDragCrane = useCraneStore((s) => s.clearDidDragCrane);
  const isDark            = useCraneStore((s) => s.isDark);

  const isHovered = hoveredSection === section;
  const isActive  = activeSection  === section;

  const SECTION_COLORS = isDark ? SECTION_COLORS_DARK : SECTION_COLORS_LIGHT;
  const HOVER_COLOR    = isDark ? HOVER_COLOR_DARK    : HOVER_COLOR_LIGHT;
  const ACTIVE_COLOR   = isDark ? ACTIVE_COLOR_DARK   : ACTIVE_COLOR_LIGHT;
  const EMISSIVE_ON    = isDark ? EMISSIVE_ON_DARK    : EMISSIVE_ON_LIGHT;

  useEffect(() => {
    if (!matRef.current) return;
    const base = new THREE.Color(SECTION_COLORS[section]);
    matRef.current.color.copy(isActive ? ACTIVE_COLOR : isHovered ? HOVER_COLOR : base);
    matRef.current.emissive.copy(isHovered || isActive ? EMISSIVE_ON : EMISSIVE_OFF);
    matRef.current.emissiveIntensity = isActive ? 0.1 : isHovered ? 0.06 : 0;
  }, [isHovered, isActive, section, isDark, SECTION_COLORS, HOVER_COLOR, ACTIVE_COLOR, EMISSIVE_ON]);

  return (
    <mesh
      geometry={geometry}
      castShadow
      receiveShadow={false}
      onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHoveredSection(section);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(_e: ThreeEvent<PointerEvent>) => {
        setHoveredSection(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (didDragCrane) {
          clearDidDragCrane();
          return;
        }
        if (activeSection === section) return;
        setActiveSection(section);
      }}
    >
      <meshStandardMaterial
        ref={matRef}
        color={SECTION_COLORS[section]}
        roughness={isDark ? 0.82 : 0.88}
        metalness={0.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Wing with velocity-driven flap ──────────────────────────────────────────
interface WingMeshProps {
  section: CraneSection;
  geometry: THREE.BufferGeometry;
  side: 'left' | 'right';
  // Shared ref to the crane root so we can read motion
  craneRootRef: React.RefObject<THREE.Group | null>;
  // Crane movement along its own local up axis (world-projected scalar velocity)
  localVerticalVelRef: React.RefObject<number>;
}

function WingMesh({ section, geometry, side, craneRootRef, localVerticalVelRef }: WingMeshProps) {
  const pivotRef = useRef<THREE.Group>(null!);

  // Compute the hinge edge (where wing meets body)
  const hingeY = useMemo(() => getWingHingeY(geometry), [geometry]);
  const hingePivot = useMemo(() => getWingHingePivot(geometry, hingeY), [geometry, hingeY]);

  const flapAngle = useRef(0);

  useFrame((_state, delta) => {
    if (!pivotRef.current || !craneRootRef.current) return;
    if (delta < 1e-4) return;

    // Use crane-local up/down motion (camera-independent).
    const rawVerticalVel = localVerticalVelRef.current ?? 0;
    const verticalVel = Math.abs(rawVerticalVel) < 0.0008 ? 0 : rawVerticalVel;

    // Flipped direction + stronger response.
    // Clamp to ±0.7 rad (~40°) for a much more aggressive flap.
    const targetFlap = Math.max(-0.7, Math.min(0.7, verticalVel * 0.34));

    // Faster settle/response.
    flapAngle.current += (targetFlap - flapAngle.current) * Math.min(1, delta * 11);

    // Rotate around local X axis as requested.
    const signedFlap = side === 'left' ? flapAngle.current : -flapAngle.current;
    pivotRef.current.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), signedFlap);
  });

  return (
    <group>
      {/* Pivot at the wing root (inner edge) */}
      <group ref={pivotRef} position={[hingePivot.x, hingePivot.y, hingePivot.z]}>
        {/* Shift geometry so its root aligns with the pivot origin */}
        <group position={[-hingePivot.x, -hingePivot.y, -hingePivot.z]}>
          <SectionMesh section={section} geometry={geometry} />
        </group>
      </group>
    </group>
  );
}

// ─── STL crane loader ─────────────────────────────────────────────────────────
function CraneModel() {
  const craneRootRef = useRef<THREE.Group>(null!);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const dragPlaneRef = useRef(new THREE.Plane());
  const dragOffsetRef = useRef(new THREE.Vector3());
  const localVerticalVelRef = useRef(0);
  const prevWorldPosRef = useRef(new THREE.Vector3());
  const hasPrevWorldPosRef = useRef(false);
  const worldPosRef = useRef(new THREE.Vector3());
  const worldUpRef = useRef(new THREE.Vector3());
  const worldQuatRef = useRef(new THREE.Quaternion());
  const deltaWorldRef = useRef(new THREE.Vector3());
  const rawGeo       = useLoader(STLLoader, '/crane.stl');

  const activeSection    = useCraneStore((s) => s.activeSection);
  const setIntroComplete = useCraneStore((s) => s.setIntroComplete);
  const isDraggingCrane  = useCraneStore((s) => s.isDraggingCrane);
  const setDraggingCrane = useCraneStore((s) => s.setDraggingCrane);
  const setDidDragCrane  = useCraneStore((s) => s.setDidDragCrane);
  const clearDidDragCrane = useCraneStore((s) => s.clearDidDragCrane);

  const sectionGeos = useMemo(() => splitGeometryBySections(rawGeo), [rawGeo]);

  useEffect(() => {
    const t = setTimeout(() => setIntroComplete(true), 600);
    return () => clearTimeout(t);
  }, [setIntroComplete]);

  // Compute movement velocity along the crane's own local up axis.
  useFrame((_state, delta) => {
    if (!craneRootRef.current) return;

    if (delta < 1e-4) {
      localVerticalVelRef.current = 0;
      return;
    }

    const root = craneRootRef.current;
    root.getWorldPosition(worldPosRef.current);

    if (!hasPrevWorldPosRef.current) {
      prevWorldPosRef.current.copy(worldPosRef.current);
      hasPrevWorldPosRef.current = true;
      localVerticalVelRef.current = 0;
      return;
    }

    root.getWorldQuaternion(worldQuatRef.current);
    worldUpRef.current.set(0, 1, 0).applyQuaternion(worldQuatRef.current).normalize();

    deltaWorldRef.current.copy(worldPosRef.current).sub(prevWorldPosRef.current);
    localVerticalVelRef.current = deltaWorldRef.current.dot(worldUpRef.current) / delta;

    prevWorldPosRef.current.copy(worldPosRef.current);
  });

  useEffect(() => {
    const endDrag = () => {
      setDraggingCrane(false);
      dragStartRef.current = null;
      lastPointerRef.current = null;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [setDraggingCrane]);

  // Gentle idle body sway — only when no section is open
  useFrame(({ clock }) => {
    if (!craneRootRef.current || activeSection || isDraggingCrane) return;
    const t = clock.getElapsedTime();
    craneRootRef.current.rotation.y = Math.sin(t * 0.4) * 0.18;
    craneRootRef.current.rotation.x = Math.sin(t * 0.25) * 0.05;
  });

  // Snap rotation back when a section opens
  useEffect(() => {
    if (activeSection && craneRootRef.current) {
      craneRootRef.current.rotation.y = 0;
      craneRootRef.current.rotation.x = 0;
    }
  }, [activeSection]);

  const leftWingGeo  = sectionGeos.get(CraneSection.LeftWing);
  const rightWingGeo = sectionGeos.get(CraneSection.RightWing);
  const bodyGeo      = sectionGeos.get(CraneSection.Body);
  const tailGeo      = sectionGeos.get(CraneSection.Tail);
  const headGeo      = sectionGeos.get(CraneSection.Head);

  return (
    <group
      ref={craneRootRef}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setDraggingCrane(true);
        clearDidDragCrane();
        localVerticalVelRef.current = 0;
        hasPrevWorldPosRef.current = false;

        const worldPos = craneRootRef.current.getWorldPosition(new THREE.Vector3());
        const normal = e.camera.getWorldDirection(new THREE.Vector3()).normalize();
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(normal, worldPos);

        const hit = new THREE.Vector3();
        if (e.ray.intersectPlane(dragPlaneRef.current, hit)) {
          dragOffsetRef.current.copy(worldPos).sub(hit);
        } else {
          dragOffsetRef.current.set(0, 0, 0);
        }

        dragStartRef.current = { x: e.clientX, y: e.clientY };
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (!isDraggingCrane || !craneRootRef.current || !lastPointerRef.current) return;

        const dx = e.clientX - lastPointerRef.current.x;
        const dy = e.clientY - lastPointerRef.current.y;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };

        // Drag in a camera-facing plane for stable movement after camera rotation.
        const hit = new THREE.Vector3();
        if (e.ray.intersectPlane(dragPlaneRef.current, hit)) {
          const targetWorld = hit.add(dragOffsetRef.current);
          const parent = craneRootRef.current.parent;
          if (parent) {
            craneRootRef.current.position.copy(parent.worldToLocal(targetWorld.clone()));
          } else {
            craneRootRef.current.position.copy(targetWorld);
          }
        }

        const start = dragStartRef.current;
        if (start) {
          const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
          if (moved > 4) setDidDragCrane(true);
        }
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        (e.target as Element).releasePointerCapture?.(e.pointerId);
        setDraggingCrane(false);
        dragStartRef.current = null;
        lastPointerRef.current = null;
        document.body.style.cursor = 'default';
      }}
    >
      {/* Static sections — no pivot needed */}
      {bodyGeo && <SectionMesh section={CraneSection.Body} geometry={bodyGeo} />}
      {tailGeo && <SectionMesh section={CraneSection.Tail} geometry={tailGeo} />}
      {headGeo && <SectionMesh section={CraneSection.Head} geometry={headGeo} />}

      {/* Wings — velocity-driven flap around their inner hinge edge */}
      {leftWingGeo && (
        <WingMesh
          section={CraneSection.LeftWing}
          geometry={leftWingGeo}
          side="left"
          craneRootRef={craneRootRef}
          localVerticalVelRef={localVerticalVelRef}
        />
      )}
      {rightWingGeo && (
        <WingMesh
          section={CraneSection.RightWing}
          geometry={rightWingGeo}
          side="right"
          craneRootRef={craneRootRef}
          localVerticalVelRef={localVerticalVelRef}
        />
      )}
    </group>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function CraneMesh() {
  return (
    <Suspense fallback={null}>
      {/* Start angled, but keep a clearer side profile */}
      <group rotation={[-Math.PI * 0.52, -Math.PI * 0.10, Math.PI * 0.18]}>
        <CraneModel />
      </group>
    </Suspense>
  );
}
