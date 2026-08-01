import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { LogoFull } from "../components/Logo";

const heroSlides = [
  { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80", key: "slide1", link: "/products?category=kitchen" },
  { img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80", key: "slide2", link: "/products?category=home-decor" },
  { img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80", key: "slide3", link: "/products" },
];

const categories = [
  { name: "Kitchen Tools", nameAr: "أدوات المطبخ", slug: "kitchen", icon: "cooking" },
  { name: "Dining Tools", nameAr: "أدوات المائدة", slug: "tableware", icon: "restaurant" },
  { name: "Home Décor", nameAr: "ديكور المنزل", slug: "home-decor", icon: "weekend" },
  { name: "Storage & Organization", nameAr: "التخزين والتنظيم", slug: "storage", icon: "inventory_2" },
  { name: "Bathroom", nameAr: "الحمام", slug: "bathroom", icon: "bathtub" },
  { name: "Linens & Textiles", nameAr: "المنسوجات", slug: "linens", icon: "bed" },
];

const testimonials = [
  { name: "سارة م.", textKey: "testimonial1", rating: 5 },
  { name: "أحمد ك.", textKey: "testimonial2", rating: 5 },
  { name: "نور ه.", textKey: "testimonial3", rating: 4 },
];

export default function Landing() {
  const { lang, t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => { api.get("/products/featured").then(r => setFeatured(r.data?.products || [])); }, []);
  useEffect(() => { const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000); return () => clearInterval(t); }, []);

  const hero = heroSlides[slide];
  const heroText = t("landing.hero." + hero.key);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-porcelain">
        {/* Mobile: image top, text bottom */}
        <div className="relative h-[260px] sm:h-[320px] md:hidden">
          {heroSlides.map((s, i) => (
            <img key={i} src={s.img} alt="" className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-700 " + (i === slide ? "opacity-100" : "opacity-0")} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-porcelain via-porcelain/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-20 flex flex-col md:flex-row items-center">
          {/* Text */}
          <div className="flex-1 px-5 sm:px-8 py-8 md:py-16 md:px-8 md:py-0 order-2 md:order-1">
            <p className="text-secondary font-cairo tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-3 font-semibold">{t("landing.eyebrow")}</p>
            <p className="text-stone text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3 sm:mb-4">{t("landing.tagline")}</p>
            <h1 className="font-cairo text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-primary leading-[1.1] whitespace-pre-line">{heroText.title}</h1>
            <p className="text-stone mt-4 sm:mt-6 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">{heroText.sub}</p>
            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link to={hero.link} className="bg-primary text-cream px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold hover:bg-accent transition card-shadow">{heroText.cta}</Link>
              <Link to="/products" className="border-2 border-primary text-primary px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold hover:bg-primary hover:text-cream transition">{t("landing.viewAll")}</Link>
            </div>
            <div className="flex gap-2 mt-6 sm:mt-8">
              {heroSlides.map((_, i) => (<button key={i} onClick={() => setSlide(i)} className={"h-2 rounded-full transition-all " + (i === slide ? "bg-secondary w-8" : "bg-taupe w-2.5")} />))}
            </div>
          </div>

          {/* Image - desktop only */}
          <div className="flex-1 relative h-[320px] md:h-[420px] lg:h-[520px] hidden md:block order-1 md:order-2">
            {heroSlides.map((s, i) => (
              <img key={i} src={s.img} alt="" className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-700 " + (i === slide ? "opacity-100" : "opacity-0")} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-porcelain/60" />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-cream border-y border-line">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 sm:gap-8 min-w-max">
            {[
              { icon: "local_shipping", title: t("features.freeDelivery"), desc: t("features.freeDeliveryDesc") },
              { icon: "verified", title: t("features.quality"), desc: t("features.qualityDesc") },
              { icon: "cached", title: t("features.returns"), desc: t("features.returnsDesc") },
              { icon: "support_agent", title: t("features.support"), desc: t("features.supportDesc") },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="material-symbols-outlined text-secondary text-lg sm:text-2xl">{f.icon}</span>
                <div><p className="text-xs sm:text-sm font-semibold text-primary">{f.title}</p><p className="text-[10px] sm:text-xs text-stone">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Introduction - mobile visible, desktop hidden */}
      <section className="md:hidden py-10 px-5 text-center">
        <LogoFull className="w-64 mx-auto" />
        <p className="text-stone text-sm mt-4 max-w-xs mx-auto leading-relaxed">{t("footer.tagline")}</p>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-secondary font-cairo text-xs sm:text-sm tracking-widest uppercase">{t("landing.browse")}</p>
          <div className="gold-divider w-8 sm:w-12 mx-auto my-2 sm:my-3" />
          <h2 className="font-cairo text-xl sm:text-2xl md:text-3xl font-bold text-primary">{t("landing.shopByCategory")}</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {categories.map(cat => (
            <Link key={cat.slug} to={"/products?category=" + cat.slug} className="group bg-porcelain border border-line rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 hover:bg-cream hover:border-secondary transition card-shadow-soft">
              <span className="material-symbols-outlined text-2xl sm:text-3xl md:text-4xl text-primary group-hover:text-secondary transition">{cat.icon}</span>
              <h3 className="font-cairo font-bold text-primary text-[10px] sm:text-xs md:text-sm leading-tight">{lang === "ar" ? cat.nameAr : cat.name}</h3>
              <span className="gold-divider w-6 sm:w-8 hidden sm:block" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <p className="text-secondary font-cairo text-xs sm:text-sm tracking-widest uppercase">{t("landing.ourPicks")}</p>
            <h2 className="font-cairo text-xl sm:text-2xl md:text-3xl font-bold text-primary mt-1">{t("landing.featuredProducts")}</h2>
          </div>
          <Link to="/products" className="text-secondary font-semibold text-xs sm:text-sm hover:underline flex items-center gap-1">{t("landing.viewAll")} <span className="material-symbols-outlined text-xs sm:text-sm rtl:rotate-180">arrow_forward</span></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-10 sm:pb-16">
        <div className="bg-porcelain border border-line rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row card-shadow">
          <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-secondary font-cairo text-xs sm:text-sm tracking-widest uppercase">{t("landing.limitedTime")}</p>
            <div className="gold-divider w-8 sm:w-12 my-2 sm:my-3" />
            <h2 className="font-cairo text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 whitespace-pre-line">{t("landing.promoTitle")}</h2>
            <p className="text-stone text-sm sm:text-base mt-3 sm:mt-4 max-w-sm">{t("landing.promoDesc")}</p>
            <Link to="/products?category=kitchen" className="bg-primary text-cream px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold mt-4 sm:mt-6 inline-block w-fit hover:bg-accent transition">{t("landing.shopTheSale")}</Link>
          </div>
          <div className="flex-1 relative min-h-[180px] sm:min-h-[220px] md:min-h-[250px]">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-porcelain/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-porcelain border-y border-line py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-10">
            <p className="text-secondary font-cairo text-xs sm:text-sm tracking-widest uppercase">{t("landing.reviews")}</p>
            <h2 className="font-cairo text-xl sm:text-2xl md:text-3xl font-bold text-primary mt-1">{t("landing.customersSay")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((r, i) => (
              <div key={i} className="bg-cream rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-line card-shadow-soft">
                <div className="flex gap-0.5 mb-2 sm:mb-3">{[...Array(5)].map((_, j) => <span key={j} className={"material-symbols-outlined text-xs sm:text-sm " + (j < r.rating ? "text-secondary" : "text-taupe")}>star</span>)}</div>
                <p className="text-stone text-xs sm:text-sm leading-relaxed">{t("landing." + r.textKey)}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-sand rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary">{r.name[0]}</div>
                  <span className="text-xs sm:text-sm font-semibold text-primary">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 text-center card-shadow">
          <h2 className="font-cairo text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-cream">{t("landing.newsletterTitle")}</h2>
          <p className="text-stone text-sm sm:text-base mt-2 max-w-md mx-auto">{t("landing.newsletterDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 max-w-md mx-auto">
            <input type="email" placeholder={t("landing.emailPlaceholder")} className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-line focus:outline-none focus:border-secondary bg-cream text-primary text-sm" />
            <button className="bg-secondary text-cream px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold hover:bg-accent transition">{t("landing.subscribe")}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
