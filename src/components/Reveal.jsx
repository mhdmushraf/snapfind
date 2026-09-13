import { useEffect, useRef, useState } from 'react';

/**
 * Fades and lifts an element into view the first time it's scrolled to.
 *
 * Uses IntersectionObserver rather than a scroll listener, so it costs
 * nothing on the main thread. Respects prefers-reduced-motion, and can be
 * switched off per studio — motion should be a choice, not an imposition.
 */
export default function Reveal({ children, delay = 0, enabled = true, className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!enabled || reduced || !ref.current) { setShown(true); return; }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setShown(true); io.disconnect(); }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(22px)',
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
