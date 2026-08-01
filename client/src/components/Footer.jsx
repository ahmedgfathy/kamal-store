import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Logo from "./Logo";
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo light className="w-32 sm:w-36" />
            <p className="text-stone text-xs sm:text-sm mt-4 max-w-xs">{t("footer.tagline")}</p>
            <p className="text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-2">{t("landing.tagline")}</p>
          </div>
          <div>
            <h4 className="font-cairo font-semibold mb-3 text-sm sm:text-base">{t("footer.quickLinks")}</h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone">
              <Link to="/products" className="block hover:text-gold transition">{t("footer.shopAll")}</Link>
              <Link to="/products?category=kitchen" className="block hover:text-gold transition">{t("footer.kitchen")}</Link>
              <Link to="/products?category=home-decor" className="block hover:text-gold transition">{t("footer.homeDecor")}</Link>
              <Link to="/products?category=linens" className="block hover:text-gold transition">{t("footer.linens")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-cairo font-semibold mb-3 text-sm sm:text-base">{t("footer.customerService")}</h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone">
              <p>{t("footer.contactUs")}</p><p>{t("footer.shippingPolicy")}</p><p>{t("footer.returns")}</p><p>{t("footer.faq")}</p>
            </div>
          </div>
          <div>
            <h4 className="font-cairo font-semibold mb-3 text-sm sm:text-base">{t("footer.followUs")}</h4>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition"><span className="material-symbols-outlined text-lg">facebook</span></a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition"><span className="material-symbols-outlined text-lg">photo_camera</span></a>
            </div>
          </div>
        </div>
        <div className="gold-divider mt-8 mb-6" />
        <div className="text-center text-[11px] sm:text-sm text-stone">&copy; {new Date().getFullYear()} {t("footer.rights")}</div>
      </div>
    </footer>
  );
}
