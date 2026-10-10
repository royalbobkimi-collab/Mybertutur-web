import type { SVGProps } from 'react';

/**
 * Lightweight inline SVG icon set (stroke-based, inherits currentColor).
 * Keeps the bundle free of icon-library dependencies while staying crisp
 * at any size. Each icon accepts standard SVG props.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MicIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </Base>
);

export const SparkIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </Base>
);

export const BookIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Base>
);

export const ChartIcon = (p: IconProps) => (
  <Base {...p}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </Base>
);

export const TargetIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <polyline points="20 6 9 17 4 12" />
  </Base>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Base>
);

export const PlayIcon = (p: IconProps) => (
  <Base {...p}>
    <polygon points="6 4 20 12 6 20 6 4" />
  </Base>
);

export const SunIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);

export const MoonIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Base>
);

export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Base>
);

export const QuoteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M12 2l2.9 6.26 6.85.72-5.1 4.62 1.4 6.7L12 16.9l-6.05 3.4 1.4-6.7-5.1-4.62 6.85-.72L12 2z" />
  </Base>
);

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11.5 14.5 15.5 10" />
  </Base>
);

export const BoltIcon = (p: IconProps) => (
  <Base {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </Base>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Base>
);

export const Logo = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="12" fill="url(#mbg)" />
    <path
      d="M14 33V16.5c0-.6.4-1 1-1h5.5c3.3 0 5.5 2 5.5 5s-2.2 5-5.5 5H17"
      stroke="white"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M30 16v12c0 2.2 1.8 4 4 4"
      stroke="white"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <circle cx="34.5" cy="13" r="2.2" fill="white" />
    <defs>
      <linearGradient id="mbg" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);
