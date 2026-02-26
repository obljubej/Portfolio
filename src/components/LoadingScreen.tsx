import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const strokeRef    = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current || !strokeRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the loading screen
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete,
        });
      },
    });

    // Animate the crane silhouette stroke
    const pathLength = strokeRef.current.getTotalLength();
    gsap.set(strokeRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    tl.to(strokeRef.current, {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: 'power2.inOut',
    });

    // Hold briefly then complete
    tl.to({}, { duration: 0.3 });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="
        fixed inset-0 z-50
        bg-paper-50
        flex flex-col items-center justify-center
        gap-8
      "
    >
      {/* Crane silhouette SVG — simple origami crane outline */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Simplified origami crane path */}
        <path
          ref={strokeRef}
          d="
            M60 20
            L40 50 L20 60 L40 70 L60 100
            L80 70 L100 60 L80 50 Z
            M60 20 L60 50
            M40 50 L60 50 L80 50
            M60 50 L60 100
          "
          stroke="#c8a882"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text */}
      <div className="text-center space-y-1">
        <p className="font-serif text-ink text-lg tracking-wide">折り紙</p>
        <p className="font-sans text-xs text-ink-muted tracking-[0.3em] uppercase">
          Loading
        </p>
      </div>

      {/* Subtle progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-paper-300 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
