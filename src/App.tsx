import { useState } from 'react';
import { Scene } from './components/Scene';
import { ContentPanel } from './components/ContentPanel';
import { NavigationHints } from './components/NavigationHints';
import { MobileGestureHandler } from './components/MobileGestureHandler';
import { LoadingScreen } from './components/LoadingScreen';
import { useCraneStore } from './crane/useCraneStore';

function AppShell() {
  const closePanel    = useCraneStore((s) => s.closePanel);
  const activeSection = useCraneStore((s) => s.activeSection);
  const isDark        = useCraneStore((s) => s.isDark);
  const toggleTheme   = useCraneStore((s) => s.toggleTheme);

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none transition-colors duration-300 ${isDark ? 'dark bg-paper-900' : 'bg-paper-200'}`}>
      {/* ── 3D Canvas — fills the whole viewport ── */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* ── Navigation hint labels (HTML overlay) ── */}
      <NavigationHints />

      {/* ── Backdrop — click outside panel to close ── */}
      {activeSection && (
        <div
          className="absolute inset-0 z-10"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* ── Sliding content panel ── */}
      <ContentPanel />

      {/* ── Mobile gesture support ── */}
      <MobileGestureHandler />

      {/* ── Site name / logo ── */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <p className="font-serif text-ink dark:text-paper-100 text-lg tracking-wide">Joshua Obljubek</p>
        <p className="font-sans text-xs text-ink-muted dark:text-paper-400 tracking-[0.25em] uppercase">
          Portfolio
        </p>
      </div>

      {/* ── Theme toggle button (hidden while a section panel is open) ── */}
      {!activeSection && (
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="
            absolute top-6 right-8 z-20
            w-9 h-9 flex items-center justify-center
            rounded-full border
            border-paper-300 dark:border-paper-700
            text-ink-muted dark:text-paper-400
            hover:text-ink dark:hover:text-paper-100
            hover:border-paper-400 dark:hover:border-paper-500
            bg-paper-50/80 dark:bg-paper-900/80
            backdrop-blur-sm
            transition-all duration-200
            text-base leading-none
          "
        >
          {isDark ? '☀' : '◑'}
        </button>
      )}

      {/* ── Keyboard shortcut hint ── */}
      <div className="absolute bottom-6 right-8 z-20 pointer-events-none hidden md:block">
        <p className="text-xs text-paper-400 dark:text-paper-600 font-mono">
          {activeSection ? 'esc to close' : ''}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {/* Render AppShell immediately so Three.js starts loading in background */}
      <AppShell />
    </>
  );
}
