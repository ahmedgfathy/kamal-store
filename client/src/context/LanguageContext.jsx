import { createContext, useContext, useEffect, useState } from "react";
import { translations, translate } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("aurum-lang") || "en");

  useEffect(() => {
    localStorage.setItem("aurum-lang", lang);
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    const body = document.body;
    if (lang === "ar") {
      body.style.setProperty("--font-heading", '"Cairo", "Poppins", sans-serif');
      body.style.setProperty("--font-body", '"Cairo", "Inter", sans-serif');
    } else {
      body.style.removeProperty("--font-heading");
      body.style.removeProperty("--font-body");
    }
  }, [lang]);

  const t = (key) => translate(lang, key);
  const toggle = () => setLang((l) => (l === "en" ? "ar" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export { translations };
