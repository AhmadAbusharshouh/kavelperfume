import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "stacked" | "horizontal" | "monogram";
  colorScheme?: "gold" | "dark" | "white" | "currentColor";
}

const MONOGRAM_PATH =
  "M 62 25 L 98 25 C 91 26, 85 30, 85 37 L 85 85 L 67 103 L 67 37 C 67 30, 61 26, 62 25 Z " +
  "M 40 131 L 67 104 L 152 24 C 154 22, 157 23, 158 25 C 140 38, 108 72, 94 99 " +
  "C 108 120, 138 148, 175 160 C 181 161.8, 185 162.2, 188 162.5 C 179 167.2, 155 167.8, 137 157.5 " +
  "C 114 143.5, 96 131.5, 85 121.5 L 85 153 C 85 160, 91 165, 98 165 L 62 165 " +
  "C 68 165, 67 160, 67 153 L 67 110 L 40 131 Z";

export function Logo({
  className = "h-14 sm:h-20",
  variant = "stacked",
  colorScheme = "gold",
}: LogoProps) {
  const gradientId = "kavelLogoGoldGradient";

  const fillSource =
    colorScheme === "gold"
      ? `url(#${gradientId})`
      : colorScheme === "dark"
      ? "#3f2911"
      : colorScheme === "white"
      ? "#ffffff"
      : "currentColor";

  return (
    <Link
      href="/"
      className="inline-flex items-center justify-center group outline-none select-none transition-transform duration-300 hover:scale-102 active:scale-98"
      aria-label="كافيل بيرفيوم - الصفحة الرئيسية"
    >
      {variant === "stacked" && (
        <svg
          viewBox="0 0 220 185"
          className={`${className} w-auto drop-shadow-[0_2px_10px_rgba(186,153,122,0.15)] transition-all duration-300 group-hover:drop-shadow-[0_4px_16px_rgba(186,153,122,0.28)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfc29f" />
              <stop offset="50%" stopColor="#ba997a" />
              <stop offset="100%" stopColor="#936d44" />
            </linearGradient>
          </defs>
          {/* Monogram Icon */}
          <g transform="translate(37, 2) scale(0.72)">
            <path fill={fillSource} fillRule="evenodd" d={MONOGRAM_PATH} />
          </g>
          {/* KAVEL Wordmark */}
          <text
            x="110"
            y="146"
            textAnchor="middle"
            fill={fillSource}
            fontFamily="'Alexandria', 'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif"
            fontSize="38"
            fontWeight="800"
            letterSpacing="0.22em"
          >
            KAVEL
          </text>
          {/* FRAGRANCE Descriptor */}
          <text
            x="110"
            y="172"
            textAnchor="middle"
            fill={fillSource}
            fontFamily="'Alexandria', 'Montserrat', 'Plus Jakarta Sans', sans-serif"
            fontSize="12"
            fontWeight="700"
            letterSpacing="0.36em"
            opacity="0.95"
          >
            FRAGRANCE
          </text>
        </svg>
      )}

      {variant === "horizontal" && (
        <svg
          viewBox="0 0 280 72"
          className={`${className} w-auto drop-shadow-[0_2px_8px_rgba(186,153,122,0.12)] transition-all duration-300 group-hover:drop-shadow-[0_4px_14px_rgba(186,153,122,0.24)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfc29f" />
              <stop offset="50%" stopColor="#ba997a" />
              <stop offset="100%" stopColor="#936d44" />
            </linearGradient>
          </defs>
          {/* Monogram Icon */}
          <g transform="translate(2, 0) scale(0.44)">
            <path fill={fillSource} fillRule="evenodd" d={MONOGRAM_PATH} />
          </g>
          {/* Wordmark Container */}
          <text
            x="88"
            y="40"
            fill={fillSource}
            fontFamily="'Alexandria', 'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif"
            fontSize="32"
            fontWeight="800"
            letterSpacing="0.22em"
          >
            KAVEL
          </text>
          <text
            x="89"
            y="61"
            fill={fillSource}
            fontFamily="'Alexandria', 'Montserrat', 'Plus Jakarta Sans', sans-serif"
            fontSize="10.5"
            fontWeight="700"
            letterSpacing="0.32em"
            opacity="0.95"
          >
            FRAGRANCE
          </text>
        </svg>
      )}

      {variant === "monogram" && (
        <svg
          viewBox="32 18 162 152"
          className={`${className} w-auto drop-shadow-[0_2px_8px_rgba(186,153,122,0.12)] transition-all duration-300 group-hover:drop-shadow-[0_4px_12px_rgba(186,153,122,0.25)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfc29f" />
              <stop offset="50%" stopColor="#ba997a" />
              <stop offset="100%" stopColor="#936d44" />
            </linearGradient>
          </defs>
          <path fill={fillSource} fillRule="evenodd" d={MONOGRAM_PATH} />
        </svg>
      )}
    </Link>
  );
}
