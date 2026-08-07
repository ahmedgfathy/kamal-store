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

const heroSlides = (t) => [
  {
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1400&q=90",
    eyebrow: "KAMAL WAHEED · 2026",
    eyebrowAr: "كمال وحيد · ٢٠٢٦",
    badge: "500+",
    titleAr: <>منزلٌ يبدأ<br /><em>بتفاصيل أجمل.</em></>,
    titleEn: <>A home that feels<br /><em>uniquely yours.</em></>,
    copyAr: "تشكيلة عصرية من أدوات المطبخ والديكور والمنسوجات، مختارة لتضيف جمالاً عملياً لكل يوم.",
    copyEn: "Modern kitchenware, décor and home textiles selected to bring practical luxury into every moment.",
    cta: t("hero.viewAll"),
    ctaTo: "/products",
    sub: "المطبخ",
    subEn: "Kitchen",
    subTo: "/products?category=kitchen",
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=90",
    eyebrow: "NEW DÉCOR · 2026",
    eyebrowAr: "ديكور جديد · ٢٠٢٦",
    badge: "NEW",
    badgeAr: "جديد",
    titleAr: <>أضفِ دفئاً<br /><em>إلى مساحتك.</em></>,
    titleEn: <>Add warmth<br /><em>to your space.</em></>,
    copyAr: "قطع ديكور مختارة بعناية تحوّل أي غرفة إلى مساحة هادئة وأنيقة. وصلت تشكيلتنا الجديدة.",
    copyEn: "Handpicked pieces that turn any room into a calm, stylish retreat. New arrivals just landed.",
    cta: t("hero.viewAll"),
    ctaTo: "/products",
    sub: t("nav.decor"),
    subEn: "Décor",
    subTo: "/products?category=home-decor",
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-44e7e70034e2?w=1400&q=90",
    eyebrow: "LIMITED OFFER · UP TO 40% OFF",
    eyebrowAr: "عرض محدود · خصم حتى 40%",
    badge: "-40%",
    badgeAr: "-40%",
    titleAr: <>المطبخ الجديد<br /><em>يبدأ بتفصيلة.</em></>,
    titleEn: <>A new kitchen<br /><em>starts with one detail.</em></>,
    copyAr: "خصومات تصل إلى 40% على أواني المطبخ وأدوات الطهي. جودة تدوم وأسعار لا تُقاوم.",
    copyEn: "Up to 40% off cookware and kitchen essentials. Quality that lasts, prices you'll love.",
    cta: t("hero.shopSale"),
    ctaTo: "/products?category=kitchen",
    sub: t("nav.sale"),
    subAr: "تخفيضات",
    subEn: "Sale",
    subTo: "/products",
  },
];

export default function Landing() {
  const { lang, t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [index, setIndex] = useState(0);
  const slides = heroSlides(t);
  const total = slides.length;

  useEffect(() => {
    api.get("/products/featured").then(r => setFeatured(r.data?.products || [])).catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % total), 4500);
    return () => clearInterval(id);
  }, [total]);

  const prev = () => setIndex(i => (i - 1 + total) % total);
  const next = () => setIndex(i => (i + 1) % total);

  return (
    <div className="store-home">
      <section className="hero-viewport">
        <div className="hero-slider" dir="ltr" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div className="hero-slide" key={i}>
              <div className="hero-slide__media">
                <img src={slide.image} alt="" loading={i === 0 ? "eager" : "lazy"} />
                <div className="new-hero__badge"><strong>{slide.badgeAr && lang === "ar" ? slide.badgeAr : slide.badge}</strong><span>{lang === "ar" ? t("hero.badgeLabelAr") : t("hero.badgeLabel")}</span></div>
              </div>
              <div className="hero-slide__content">
                <p className="eyebrow">{lang === "ar" ? slide.eyebrowAr : slide.eyebrow}</p>
                <h1>{lang === "ar" ? slide.titleAr : slide.titleEn}</h1>
                <p className="new-hero__copy">{lang === "ar" ? slide.copyAr : slide.copyEn}</p>
                <div className="new-hero__actions">
                  <Link to={slide.ctaTo} className="button-primary">{slide.cta} <span>←</span></Link>
                  <Link to={slide.subTo} className="button-link">{lang === "ar" ? (slide.subAr || slide.sub) : (slide.subEn || slide.sub)}</Link>
                </div>
                <div className="new-hero__facts">
                  <div><strong>14</strong><span>{lang === "ar" ? "يوم للاسترجاع" : "day returns"}</span></div>
                  <div><strong>500</strong><span>{lang === "ar" ? "ج.م للشحن المجاني" : "EGP free shipping"}</span></div>
                  <div><strong>4.8</strong><span>{lang === "ar" ? "تقييم العملاء" : "customer rating"}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="hero-arrow hero-arrow--prev" onClick={prev} aria-label="Previous slide">‹</button>
        <button className="hero-arrow hero-arrow--next" onClick={next} aria-label="Next slide">›</button>
        <div className="hero-dots">
          {slides.map((_, i) => <button key={i} onClick={() => setIndex(i)} className={i === index ? "active" : ""} aria-label={`Slide ${i + 1}`} />)}
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