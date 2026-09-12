import { useMemo } from 'react';
import { qrMatrix } from '@/lib/qr';

/**
 * Renders a scannable QR code as inline SVG. No dependency, no network call.
 * `value` is the full URL the guest will land on.
 */
export default function QRCode({ value, size = 200, className = '', dark = 'hsl(var(--primary))' }) {
  const matrix = useMemo(() => {
    try { return qrMatrix(value); } catch { return null; }
  }, [value]);

  if (!matrix) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl text-xs text-muted-foreground ${className}`} style={{ width: size, height: size }}>
        QR unavailable
      </div>
    );
  }

  const n = matrix.length;
  const margin = 3;
  const total = n + margin * 2;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      className={`rounded-xl bg-white ${className}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Event QR code"
    >
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c + margin} y={r + margin} width="1" height="1" fill={dark} /> : null
        )
      )}
    </svg>
  );
}
