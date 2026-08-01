import { Link } from "react-router-dom";
function LogoCompact({ light = false, className = "" }) {
  const stroke = light ? "#FEFEFE" : "#1F1C15";
  return (
    <svg viewBox="0 0 260 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Kamal Waheed logo">
      <defs>
        <linearGradient id="lwGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D6A24A"/>
          <stop offset="50%" stopColor="#A86D1F"/>
          <stop offset="100%" stopColor="#6F4318"/>
        </linearGradient>
        <linearGradient id="lwRoofGold" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#D6A24A"/>
          <stop offset="100%" stopColor="#A86D1F"/>
        </linearGradient>
      </defs>
      {/* Roof */}
      <path d="M 60 52 L 130 15 L 200 52" fill="none" stroke="url(#lwRoofGold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Chimney */}
      <rect x="162" y="12" width="8" height="16" rx="1.5" fill={stroke}/>
      <rect x="159" y="8" width="14" height="6" rx="2" fill={stroke}/>
      {/* Window panes */}
      <g transform="translate(120, 28)">
        <rect width="8" height="8" rx="1" fill="url(#lwGold)"/>
        <rect x="11" width="8" height="8" rx="1" fill="url(#lwGold)"/>
        <rect y="11" width="8" height="8" rx="1" fill="url(#lwGold)"/>
        <rect x="11" y="11" width="8" height="8" rx="1" fill="url(#lwGold)"/>
      </g>
      {/* Arabic: كمال (right) */}
      <text x="185" y="98" fontFamily="'Amiri', serif" fontSize="48" fontWeight="700" fill={stroke} textAnchor="end" direction="rtl">كمال</text>
      {/* Arabic: وحيد (left) - gold */}
      <text x="130" y="108" fontFamily="'Amiri', serif" fontSize="44" fontWeight="700" fill="url(#lwGold)" textAnchor="middle" direction="rtl">وحيد</text>
      {/* English: Kamal Waheed */}
      <text x="130" y="128" fontFamily="'Amiri', Georgia, serif" fontSize="17" fontStyle="italic" fill={stroke} textAnchor="middle" letterSpacing="0.5">Kamal Waheed</text>
      {/* Gold underline */}
      <path d="M 60 130 Q 130 138 200 130" stroke="url(#lwGold)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function LogoFull({ className = "" }) {
  return (
    <svg viewBox="0 0 600 780" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Kamal Waheed full logo">
      <defs>
        <linearGradient id="fgGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D6A24A"/>
          <stop offset="50%" stopColor="#A86D1F"/>
          <stop offset="100%" stopColor="#6F4318"/>
        </linearGradient>
        <linearGradient id="fgRoofGold" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#D6A24A"/>
          <stop offset="100%" stopColor="#A86D1F"/>
        </linearGradient>
        <linearGradient id="fgArabicGold" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#8B6914"/>
          <stop offset="35%" stopColor="#C9A033"/>
          <stop offset="65%" stopColor="#A86D1F"/>
          <stop offset="100%" stopColor="#6F4318"/>
        </linearGradient>
        <linearGradient id="fgSwoosh" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A033"/>
          <stop offset="50%" stopColor="#A86D1F"/>
          <stop offset="100%" stopColor="#D6A24A"/>
        </linearGradient>
        <linearGradient id="fgIconGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A86D1F"/>
          <stop offset="100%" stopColor="#6F4318"/>
        </linearGradient>
        <filter id="fgShadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1F1C15" floodOpacity="0.18"/></filter>
      </defs>
      <rect width="600" height="780" fill="#FEFEFE"/>
      {/* Roof */}
      <path d="M 155 155 L 300 60 L 445 155" fill="none" stroke="url(#fgRoofGold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 155 155 L 300 60 L 445 155 Z" fill="#FEFEFE" fillOpacity="0.6"/>
      <rect x="375" y="55" width="14" height="35" rx="2" fill="#1F1C15"/>
      <rect x="371" y="48" width="22" height="10" rx="3" fill="#1F1C15"/>
      {/* Window panes */}
      <g transform="translate(280, 88)">
        <rect width="14" height="14" rx="1.5" fill="url(#fgGold)"/>
        <rect x="18" width="14" height="14" rx="1.5" fill="url(#fgGold)"/>
        <rect y="18" width="14" height="14" rx="1.5" fill="url(#fgGold)"/>
        <rect x="18" y="18" width="14" height="14" rx="1.5" fill="url(#fgGold)"/>
      </g>
      {/* Decorative curve left */}
      <path d="M 120 420 C 60 350 80 220 200 160" stroke="#1F1C15" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 130 410 C 75 345 90 230 205 168" stroke="url(#fgSwoosh)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 420 400 C 480 340 470 250 400 200" stroke="url(#fgSwoosh)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* Arabic text */}
      <text x="245" y="310" fontFamily="'Amiri', serif" fontSize="110" fontWeight="700" fill="url(#fgArabicGold)" textAnchor="middle" filter="url(#fgShadow)" direction="rtl">وحيد</text>
      <text x="385" y="290" fontFamily="'Amiri', serif" fontSize="115" fontWeight="700" fill="#1F1C15" textAnchor="middle" filter="url(#fgShadow)" direction="rtl">كمال</text>
      {/* English */}
      <text x="300" y="385" fontFamily="'Amiri', Georgia, serif" fontSize="44" fontStyle="italic" fill="#1F1C15" textAnchor="middle" letterSpacing="1">Kamal Waheed</text>
      <path d="M 170 400 Q 300 420 430 398" stroke="url(#fgSwoosh)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Category icons */}
      <g transform="translate(155, 440)">
        {/* Pot */}
        <g><rect x="6" y="10" width="26" height="16" rx="3" fill="none" stroke="url(#fgIconGold)" strokeWidth="2.5"/><path d="M 4 10 Q 4 4 19 4 Q 34 4 34 10" fill="none" stroke="url(#fgIconGold)" strokeWidth="2.5" strokeLinecap="round"/><line x1="19" y1="1" x2="19" y2="4" stroke="url(#fgIconGold)" strokeWidth="2.5" strokeLinecap="round"/><circle cx="19" cy="1" r="2" fill="url(#fgIconGold)"/></g>
        {/* Fork+Knife */}
        <g transform="translate(72,0)"><path d="M 12 3 L 12 26" stroke="url(#fgIconGold)" strokeWidth="2.2" strokeLinecap="round"/><path d="M 12 3 Q 18 3 18 10 L 12 10" fill="none" stroke="url(#fgIconGold)" strokeWidth="2.2" strokeLinecap="round"/><path d="M 23 3 L 23 10 M 26 3 L 26 10 M 29 3 L 29 10" stroke="url(#fgIconGold)" strokeWidth="2" strokeLinecap="round"/><line x1="26" y1="10" x2="26" y2="26" stroke="url(#fgIconGold)" strokeWidth="2.2" strokeLinecap="round"/></g>
        {/* Plate */}
        <g transform="translate(142,0)"><circle cx="18" cy="14" r="13" fill="none" stroke="url(#fgIconGold)" strokeWidth="2.5"/><circle cx="18" cy="14" r="7" fill="none" stroke="url(#fgIconGold)" strokeWidth="1.5" opacity="0.5"/></g>
        {/* Vase */}
        <g transform="translate(215,0)"><path d="M 14 28 L 14 18 Q 14 14 18 14 Q 22 14 22 18 L 22 28 Z" fill="none" stroke="url(#fgIconGold)" strokeWidth="2.5"/><path d="M 18 14 Q 18 6 12 3" fill="none" stroke="url(#fgIconGold)" strokeWidth="2" strokeLinecap="round"/><path d="M 18 14 Q 18 8 24 5" fill="none" stroke="url(#fgIconGold)" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="3" r="2" fill="url(#fgIconGold)" opacity="0.7"/><circle cx="24" cy="5" r="2" fill="url(#fgIconGold)" opacity="0.7"/></g>
        {/* Lamp */}
        <g transform="translate(288,0)"><path d="M 10 14 L 26 14" stroke="url(#fgIconGold)" strokeWidth="2.5" strokeLinecap="round"/><path d="M 10 14 L 6 3 Q 18 -2 30 3 L 26 14" fill="none" stroke="url(#fgIconGold)" strokeWidth="2.2" strokeLinecap="round"/><line x1="18" y1="14" x2="18" y2="26" stroke="url(#fgIconGold)" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="18" cy="27" rx="8" ry="2" fill="none" stroke="url(#fgIconGold)" strokeWidth="2" strokeLinecap="round"/></g>
      </g>
      {/* Gold dividers */}
      <line x1="100" y1="510" x2="250" y2="510" stroke="url(#fgGold)" strokeWidth="1.2"/>
      <circle cx="100" cy="510" r="3" fill="url(#fgGold)"/>
      <circle cx="250" cy="510" r="2" fill="url(#fgGold)"/>
      <line x1="350" y1="510" x2="500" y2="510" stroke="url(#fgGold)" strokeWidth="1.2"/>
      <circle cx="350" cy="510" r="2" fill="url(#fgGold)"/>
      <circle cx="500" cy="510" r="3" fill="url(#fgGold)"/>
      <circle cx="300" cy="510" r="4" fill="url(#fgGold)"/>
      {/* Tagline */}
      <text x="300" y="555" fontFamily="'Amiri', serif" fontSize="28" fontWeight="700" fill="#1F1C15" textAnchor="middle" direction="rtl">ادوات منزلية وديكور</text>
      {/* Bottom ornament */}
      <g transform="translate(265, 580)" fill="url(#fgGold)">
        <path d="M 35 20 C 35 12 28 8 25 2 C 22 8 15 12 15 20 C 15 26 20 30 25 34 C 30 30 35 26 35 20Z" opacity="0.8"/>
        <circle cx="25" cy="15" r="2" fill="#FEFEFE"/>
        <path d="M 10 18 C 6 14 6 8 10 6 C 12 10 12 14 10 18Z" opacity="0.5"/>
        <path d="M 40 18 C 44 14 44 8 40 6 C 38 10 38 14 40 18Z" opacity="0.5"/>
      </g>
      <circle cx="300" cy="340" r="280" fill="none" stroke="url(#fgSwoosh)" strokeWidth="0.8" opacity="0.15" strokeDasharray="8 12"/>
    </svg>
  );
}

export default function Logo({ className = "", full = false, light = false }) {
  if (full) {
    return (
      <Link to="/" className={"block " + className}>
        <LogoFull className="w-full max-w-md mx-auto" />
      </Link>
    );
  }

  return (
    <Link to="/" className={"block group " + className}>
      <LogoCompact light={light} className="w-full h-auto" />
    </Link>
  );
}

export { LogoFull };
