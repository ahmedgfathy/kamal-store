import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-cairo text-xl font-bold mb-4 text-sand">AURUM &amp; CO.</h3>
            <p className="text-gray-400 text-sm">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="font-cairo font-semibold mb-3">{t("footer.quickLinks")}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/products" className="block hover:text-secondary transition">{t("footer.shopAll")}</Link>
              <Link to="/products?category=kitchen" className="block hover:text-secondary transition">{t("footer.kitchen")}</Link>
              <Link to="/products?category=home-decor" className="block hover:text-secondary transition">{t("footer.homeDecor")}</Link>
              <Link to="/products?category=linens" className="block hover:text-secondary transition">{t("footer.linens")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-cairo font-semibold mb-3">{t("footer.customerService")}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{t("footer.contactUs")}</p><p>{t("footer.shippingPolicy")}</p><p>{t("footer.returns")}</p><p>{t("footer.faq")}</p>
            </div>
          </div>
          <div>
            <h4 className="font-cairo font-semibold mb-3">{t("footer.followUs")}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition"><span className="material-symbols-outlined">facebook</span></a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition"><span className="material-symbols-outlined">photo_camera</span></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} {t("footer.rights")}</div>
      </div>
    </footer>
  );
}
