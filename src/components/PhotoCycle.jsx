import { GALLERY } from '@/lib/images';

/**
 * Slow crossfade between photos, with a gentle Ken Burns drift.
 * Pure CSS — no JS timers, no state, nothing to clean up on unmount.
 *
 * Pass `images` (an array of src strings) so different pages can show
 * different sets. Defaults to the whole gallery.
 */
export default function PhotoCycle({ images, seconds = 32, className = '' }) {
  const srcs = images && images.length ? images : GALLERY.map((g) => g.src);
  const n = srcs.length;
  const step = 100 / n;
  const id = `pc${n}x${Math.round(seconds)}`;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {srcs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: `${id} ${seconds}s ease-in-out infinite, ken-burns ${(seconds / n) * 2}s ease-in-out infinite alternate`,
            animationDelay: `${(-seconds / n) * (n - i)}s, ${(-seconds / n) * (n - i)}s`,
            opacity: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes ${id} {
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
