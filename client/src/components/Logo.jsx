import { Link } from "react-router-dom";

export default function Logo({ className = "", light = false }) {
  return (
    <Link to="/" className={`block ${className}`} aria-label="Kamal Waheed home">
      <img
        src="/kamal-waheed-logo.svg"
        alt="كمال وحيد — Kamal Waheed"
        className={`block w-full h-auto ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

export function LogoFull({ className = "" }) {
  return <img src="/kamal-waheed-logo.svg" alt="كمال وحيد — Kamal Waheed" className={className} />;
}
