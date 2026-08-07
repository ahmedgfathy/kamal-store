import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Logo from "./Logo";

export default function Footer() {
  const { lang, t } = useLanguage();
  return <footer className="new-footer">
    <div className="page-shell new-footer__newsletter"><div><p>{lang === "ar" ? "ابقَ قريباً" : "STAY IN THE LOOP"}</p><h2>{t("landing.newsletterTitle")}</h2></div><form><input type="email" placeholder={t("landing.emailPlaceholder")} /><button type="button">{t("landing.subscribe")} ←</button></form></div>
    <div className="page-shell new-footer__grid"><div><Logo light className="new-footer__logo" /><p>{t("footer.tagline")}</p></div><div><h4>{t("footer.quickLinks")}</h4><Link to="/products">{t("footer.shopAll")}</Link><Link to="/products?category=kitchen">{t("footer.kitchen")}</Link><Link to="/products?category=home-decor">{t("footer.homeDecor")}</Link></div><div><h4>{t("footer.customerService")}</h4><span>{t("footer.contactUs")}</span><span>{t("footer.shippingPolicy")}</span><span>{t("footer.returns")}</span></div><div><h4>{t("footer.followUs")}</h4><a href="#">Instagram</a><a href="#">Facebook</a></div></div>
    <div className="page-shell new-footer__bottom"><span>© {new Date().getFullYear()} {t("footer.rights")}</span><span>CAIRO · EGYPT</span></div>
  </footer>;
}
