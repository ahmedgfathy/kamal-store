import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Logo({ className = "", light = false }) {
  const { lang } = useLanguage();
  return (
    <Link to="/" className={`text-logo ${light ? "text-logo--light" : ""} ${className}`} aria-label="Kamal Waheed home">
      <span className="text-logo__name">{lang === "ar" ? "كمال وحيد" : "Kamal Waheed"}</span>
      <span className="text-logo__tag">{lang === "ar" ? "منزل · مطبخ · ديكور" : "HOME · KITCHEN · DÉCOR"}</span>
    </Link>
  );
}

export function LogoFull({ className = "" }) {
  const { lang } = useLanguage();
  return (
    <span className={`text-logo ${className}`}>
      <span className="text-logo__name">{lang === "ar" ? "كمال وحيد" : "Kamal Waheed"}</span>
      <span className="text-logo__tag">{lang === "ar" ? "منزل · مطبخ · ديكور" : "HOME · KITCHEN · DÉCOR"}</span>
    </span>
  );
}
