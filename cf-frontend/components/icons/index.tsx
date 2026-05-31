interface IconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function TruckIcon({ className, width = 24, height = 24 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function StarIcon({ className, width = 24, height = 24 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function PhoneIcon({ className, width = 24, height = 24 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function DollarIcon({ className, width = 24, height = 24 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function OfficeChairIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6c0-2.2 2.7-4 6-4s6 1.8 6 4v8H10V6z" />
      <path d="M8 14h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
      <line x1="16" y1="18" x2="16" y2="24" />
      <path d="M10 24h12" />
      <line x1="10" y1="24" x2="7" y2="29" />
      <line x1="22" y1="24" x2="25" y2="29" />
    </svg>
  );
}

export function DoubleBedIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="26" height="8" rx="1" />
      <path d="M6 14v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
      <rect x="7" y="10" width="7" height="4" rx="1" />
      <rect x="18" y="10" width="7" height="4" rx="1" />
      <line x1="5" y1="22" x2="5" y2="26" />
      <line x1="27" y1="22" x2="27" y2="26" />
    </svg>
  );
}

export function SofaSetIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 14V10a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v4" />
      <path d="M3 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6H3v-6z" />
      <path d="M25 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6h-4v-6z" />
      <rect x="7" y="14" width="18" height="6" />
      <path d="M3 20h26v3H3z" />
      <line x1="6" y1="23" x2="6" y2="26" />
      <line x1="26" y1="23" x2="26" y2="26" />
    </svg>
  );
}

export function OfficeTableIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="26" height="3" rx="1" />
      <line x1="6" y1="13" x2="6" y2="26" />
      <line x1="26" y1="13" x2="26" y2="26" />
      <rect x="8" y="13" width="10" height="5" rx="0.5" />
    </svg>
  );
}

export function DiningTableIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="16" cy="10" rx="13" ry="3" />
      <line x1="16" y1="13" x2="16" y2="27" />
      <line x1="8" y1="12" x2="5" y2="27" />
      <line x1="24" y1="12" x2="27" y2="27" />
    </svg>
  );
}

export function WeddingIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4C13 4 10 7 10 11c0 3 2 5 6 9 4-4 6-6 6-9 0-4-3-7-6-7z" />
      <path d="M13 14l-5 12h16l-5-12" />
      <line x1="10" y1="22" x2="22" y2="22" />
      <line x1="16" y1="14" x2="16" y2="26" />
    </svg>
  );
}

export function KidsFurnitureIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="9" r="5" />
      <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M13 8l1 2h4l1-2" />
    </svg>
  );
}

export function CenterTableIcon({ className, width = 32, height = 32 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="16" cy="12" rx="12" ry="3" />
      <line x1="10" y1="14" x2="8" y2="26" />
      <line x1="22" y1="14" x2="24" y2="26" />
      <line x1="16" y1="15" x2="16" y2="26" />
    </svg>
  );
}

export function DecorativeLeaf({ className, width = 64, height = 64 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 64 64" fill="none">
      <path
        d="M16 48C16 48 8 32 20 16C32 0 52 4 52 4C52 4 56 24 44 40C32 56 16 48 16 48Z"
        stroke="#E8B800"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <path
        d="M20 44C28 32 36 20 50 8"
        stroke="#E8B800"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M28 40C24 32 24 24 30 14"
        stroke="#E8B800"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  );
}
