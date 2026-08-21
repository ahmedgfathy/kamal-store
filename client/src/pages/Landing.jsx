import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";

const categories = [
  { name: "Cookware", nameAr: "أواني الطهي", slug: "kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&q=85" },
  { name: "Tableware", nameAr: "أدوات المائدة", slug: "tableware", image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=700&q=85" },
  { name: "Home décor", nameAr: "ديكور المنزل", slug: "home-decor", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85" },
  { name: "Storage", nameAr: "التخزين والتنظيم", slug: "storage", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=700&q=85" },
];

export default function Landing() {
  const { lang, t } = useLanguage();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products/featured").then(r => setFeatured(r.data?.products || [])).catch(() => setFeatured([]));
  }, []);

  return (
    <div className="store-home">
      {/* Hero with YouTube Video Background */}
      <section className="hero-video-section">
        <div className="hero-video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/BnaMpGqeXaE?autoplay=1&mute=1&loop=1&playlist=BnaMpGqeXaE&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1"
            title="Luxury Home Interior"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="hero-video-iframe"
          />
          <div className="hero-video-overlay" />
          <div className="hero-video-content page-shell">
            <p className="eyebrow">{lang === "ar" ? "كمال وحيد · ٢٠٢٦" : "KAMAL WAHEED · 2026"}</p>
            <h1>{lang === "ar" ? <>منزلٌ يبدأ<br /><em>بتفاصيل أجمل.</em></> : <>A home that feels<br /><em>uniquely yours.</em></>}</h1>
            <p className="new-hero__copy">{lang === "ar" ? "تشكيلة عصرية من أدوات المطبخ والديكور والمنسوجات، مختارة لتضيف جمالاً عملياً لكل يوم." : "Modern kitchenware, décor and home textiles selected to bring practical luxury into every moment."}</p>
            <div className="new-hero__actions">
              <Link to="/products" className="button-primary">{t("hero.viewAll")} <span>←</span></Link>
              <Link to="/products?category=kitchen" className="button-link">{lang === "ar" ? "المطبخ" : "Kitchen"}</Link>
            </div>
            <div className="new-hero__facts">
              <div><strong>14</strong><span>{lang === "ar" ? "يوم للاسترجاع" : "day returns"}</span></div>
              <div><strong>500</strong><span>{lang === "ar" ? "ج.م للشحن المجاني" : "EGP free shipping"}</span></div>
              <div><strong>4.8</strong><span>{lang === "ar" ? "تقييم العملاء" : "customer rating"}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-showcase page-shell">
        <div className="section-heading">
          <div><p className="eyebrow">{lang === "ar" ? "اختر مساحتك" : "SHOP YOUR SPACE"}</p><h2>{t("landing.shopByCategory")}</h2></div>
          <Link to="/products">{t("landing.viewAll")} <span>←</span></Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link to={`/products?category=${category.slug}`} className={`category-tile category-tile--${index + 1}`} key={category.slug}>
              <img src={category.image} alt={lang === "ar" ? category.nameAr : category.name} />
              <div><span>0{index + 1}</span><h3>{lang === "ar" ? category.nameAr : category.name}</h3><p>{lang === "ar" ? "اكتشف المجموعة" : "View collection"} ←</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section page-shell">
        <div className="section-heading">
          <div><p className="eyebrow">{t("landing.ourPicks")}</p><h2>{t("landing.featuredProducts")}</h2></div>
          <Link to="/products">{t("landing.viewAll")} <span>←</span></Link>
        </div>
        {featured.length ? <div className="featured-grid">{featured.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="collection-placeholder"><p>{lang === "ar" ? "جاري تجهيز اختياراتنا لك" : "Our new collection is being prepared"}</p><Link to="/products" className="button-primary">{t("landing.viewAll")}</Link></div>}
      </section>

      <section className="editorial-banner page-shell">
        <div className="editorial-banner__copy"><p className="eyebrow">{t("landing.limitedTime")}</p><h2>{lang === "ar" ? "المطبخ الجديد يبدأ بتفصيلة." : "A new kitchen starts with one detail."}</h2><p>{t("landing.promoDesc")}</p><Link to="/products?category=kitchen" className="button-light">{t("landing.shopTheSale")} ←</Link></div>
        <img src="https://images.unsplash.com/photo-1556912167-f556f411f39fdf?w=1200&q=90" alt="Modern kitchen collection" />
      </section>

      <section className="service-strip page-shell">
        {[["✦", t("features.quality"), t("features.qualityDesc")], ["↺", t("features.returns"), t("features.returnsDesc")], ["⌂", t("features.freeDelivery"), t("features.freeDeliveryDesc")]].map(([icon, title, copy]) => <div key={title}><b>{icon}</b><span><strong>{title}</strong><small>{copy}</small></span></div>)}
      </section>
    </div>
  );
}
