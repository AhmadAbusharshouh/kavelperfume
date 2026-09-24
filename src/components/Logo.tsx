import Link from "next/link";

export function Logo({ className = "h-20" }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center justify-center group outline-none" aria-label="Kavel Perfume Home">
      <svg
        viewBox="0 0 240 80"
        className={`${className} w-auto transition-transform duration-300 group-hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Luxury Shield / Emblem */}
        <path
          d="M120 4L142 16V42C142 58 120 74 120 74C120 74 98 58 98 42V16L120 4Z"
          fill="#3f2911"
          stroke="#ba997a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Monogram 'K' */}
        <path
          d="M112 22V54M112 38L128 22M117 34L128 54"
          stroke="#ba997a"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crown / Accent Diamonds */}
        <polygon points="120,10 123,15 120,18 117,15" fill="#ba997a" />
        <circle cx="106" cy="18" r="1.5" fill="#ba997a" />
        <circle cx="134" cy="18" r="1.5" fill="#ba997a" />
      </svg>
    </Link>
  );
}
