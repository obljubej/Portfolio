import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { TrackballControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CraneMesh } from '../crane/CraneMesh';
import { useCraneStore } from '../crane/useCraneStore';

function Lighting({ isDark }: { isDark: boolean }) {
  return (
    <>
      {/* Ambient — soft fill */}
      <ambientLight intensity={isDark ? 0.3 : 0.6} color={isDark ? '#1a2030' : '#f5f0e8'} />

      {/* Key light — warm/cool directional from upper-left */}
      <directionalLight
        position={[-3, 5, 3]}
        intensity={isDark ? 0.8 : 1.2}
        color={isDark ? '#c8d8f0' : '#fff8f0'}
        castShadow
        shadow-bias={0.0015}
        shadow-normalBias={0.06}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Fill light */}
      <directionalLight
        position={[4, 2, -2]}
        intensity={isDark ? 0.2 : 0.4}
        color={isDark ? '#8090b0' : '#e8f0f5'}
      />

      {/* Rim light */}
      <pointLight
        position={[0, -2, -3]}
        intensity={isDark ? 0.5 : 0.3}
        color={isDark ? '#4060a0' : '#d4c8b8'}
      />
    </>
  );
}

function CameraRig() {
  const activeSection = useCraneStore((s) => s.activeSection);
  const isDraggingCrane = useCraneStore((s) => s.isDraggingCrane);
  const targetX = activeSection ? -0.8 : 0;

  return (
    <TrackballControls
      noPan={true}
      noZoom={false}
      noRotate={isDraggingCrane}
      rotateSpeed={3.2}
      zoomSpeed={1.1}
      dynamicDampingFactor={0.12}
      minDistance={2}
      maxDistance={12}
      target={[targetX, 0, 0]}
    />
  );
}

export function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark    = useCraneStore((s) => s.isDark);

  const fogColor = isDark ? '#0d1117' : '#f4f1ec';

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 1.5, 6], fov: 45, near: 0.1, far: 100 }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 0.8 : 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ background: 'transparent', touchAction: 'none' }}
    >
      <Lighting isDark={isDark} />
      <CameraRig />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={isDark ? 0.4 : 0.18}
        scale={8}
        blur={2.5}
        far={4}
        color={isDark ? '#000820' : '#8a7060'}
      />

      {/* Environment for reflections */}
      <Environment preset={isDark ? 'night' : 'studio'} />

      {/* Fog */}
      <fog attach="fog" args={[fogColor, 12, 30]} />

      <Suspense fallback={null}>
        <CraneMesh />
      </Suspense>
    </Canvas>
  );
}
