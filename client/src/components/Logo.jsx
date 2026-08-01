import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RoofIcon({ className = "", light = false }) {
  return (
    <svg viewBox="0 0 180 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 55 L90 10 L160 55" stroke="#A86D1F" strokeWidth="8" strokeLinecap="round" />
      <path d="M118 31 v-22 h18 v34" stroke={light ? "#FEFEFE" : "#1F1C15"} strokeWidth="6" />
      <rect x="82" y="32" width="16" height="28" rx="2" fill={light ? "#FEFEFE" : "#1F1C15"} />
      <rect x="104" y="32" width="16" height="28" rx="2" fill={light ? "#FEFEFE" : "#1F1C15"} />
    </svg>
  );
}

export default function Logo({ className = "", light = false }) {
  const { lang } = useLanguage();
  const title = light ? "text-cream" : "text-primary";
  const tagline = light ? "text-gold" : "text-secondary";
  const name = lang === "ar" ? "كمال وحيد" : "Kamal Waheed";
  const slogan = lang === "ar" ? "جودة تختارها وأناقة تعيشها" : "Quality you choose, style you live";

  return (
    <Link to="/" className={"flex items-center gap-3 group " + className}>
      <RoofIcon light={light} className="w-10 h-8 shrink-0 group-hover:scale-105 transition" />
      <span className="leading-none">
        <span className={"font-amiri text-2xl font-bold block leading-tight " + title}>{name}</span>
        <span className={"text-[9px] tracking-[0.18em] uppercase block mt-0.5 " + tagline}>{slogan}</span>
      </span>
    </Link>
  );
}
