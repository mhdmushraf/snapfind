import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Snapfind logo — viewfinder brackets with a coral focus dot.
 * mark: teal rounded square, white corner brackets, coral dot.
 */
export function LogoMark({ className, size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="hsl(var(--primary))" />
      {/* viewfinder brackets */}
      <path d="M18 27V21a3 3 0 0 1 3-3h6" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 27V21a3 3 0 0 0-3-3h-6" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M18 37v6a3 3 0 0 0 3 3h6" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 37v6a3 3 0 0 1-3 3h-6" stroke="white" strokeWidth="4" strokeLinecap="round" />
      {/* focus dot */}
      <circle cx="32" cy="32" r="6" fill="hsl(var(--accent))" />
    </svg>
  );
}

export default function Logo({ className, inverted = false, size = 32, to = '/' }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2.5 group', className)}>
      <LogoMark size={size} className="group-hover:scale-105 transition-transform duration-300" />
      <span
        className={cn(
          'font-heading text-xl font-bold tracking-tight',
          inverted ? 'text-white' : 'text-foreground'
        )}
      >
        Snap<span className="text-accent">find</span>
      </span>
    </Link>
  );
}
