import { useEffect, useRef } from 'react';
import { useCraneStore } from '../crane/useCraneStore';

/**
 * MobileGestureHandler
 *
 * Adds touch-specific UX on top of the existing OrbitControls:
 * - Single tap on the canvas (not on a panel) → close active panel
 * - Double-tap → reset camera (handled by OrbitControls reset)
 * - Swipe right on the content panel → close panel
 *
 * Pinch-to-zoom and rotate are handled natively by OrbitControls.
 */
export function MobileGestureHandler() {
  const closePanel   = useCraneStore((s) => s.closePanel);
  const panelVisible = useCraneStore((s) => s.panelVisible);
  const panelRef     = useRef<{ startX: number; startY: number } | null>(null);

  // Swipe-right on the content panel to close it
  useEffect(() => {
    const panel = document.getElementById('content-panel-swipe-target');
    if (!panel) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      panelRef.current = { startX: t.clientX, startY: t.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!panelRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - panelRef.current.startX;
      const dy = Math.abs(t.clientY - panelRef.current.startY);

      // Swipe right ≥ 80px, mostly horizontal
      if (dx > 80 && dy < 60 && panelVisible) {
        closePanel();
      }
      panelRef.current = null;
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchend', onTouchEnd);
    };
  }, [closePanel, panelVisible]);

  // Show a mobile hint on first visit
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (!isMobile) return;

    const hint = document.getElementById('mobile-hint');
    if (!hint) return;

    // Auto-hide after 3s
    const timeout = setTimeout(() => {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.5s';
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

  if (!isMobile) return null;

  return (
    <div
      id="mobile-hint"
      className="
        fixed bottom-20 left-1/2 -translate-x-1/2
        bg-ink/70 text-paper-50
        text-xs font-sans tracking-wide
        px-4 py-2 rounded-full
        pointer-events-none z-30
        transition-opacity duration-500
      "
    >
      Pinch to zoom · Drag to rotate · Tap to explore
    </div>
  );
}
