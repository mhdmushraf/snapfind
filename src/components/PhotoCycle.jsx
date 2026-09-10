import { GALLERY } from '@/lib/images';

/**
 * Slow crossfade between all gallery photos, with a gentle Ken Burns drift.
 * Pure CSS — no JS timers, no state, nothing to clean up on unmount.
 *
 * Each photo is stacked and given a staggered animation delay so exactly one
 * is visible at a time. Total cycle = seconds; each photo holds for
 * seconds / GALLERY.length.
 */
export default function PhotoCycle({ seconds = 30, className = '' }) {
  const n = GALLERY.length;
  const step = 100 / n;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {GALLERY.map((g, i) => (
        <img
          key={g.src}
          src={g.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: `photo-cycle-${n} ${seconds}s ease-in-out infinite, ken-burns ${seconds / n * 2}s ease-in-out infinite alternate`,
            animationDelay: `${(-seconds / n) * (n - i)}s, ${(-seconds / n) * (n - i)}s`,
            opacity: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes photo-cycle-${n} {
          0%              { opacity: 0; }
          ${step * 0.15}% { opacity: 1; }
          ${step * 0.85}% { opacity: 1; }
          ${step}%        { opacity: 0; }
          100%            { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
