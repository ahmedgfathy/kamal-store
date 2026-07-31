import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";

const heroSlides = [
  { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80", key: "slide1", link: "/products?category=kitchen" },
  { img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80", key: "slide2", link: "/products?category=home-decor" },
  { img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80", key: "slide3", link: "/products" },
];

const categories = [
  { name: "Kitchen Essentials", nameAr: "المطبخ", slug: "kitchen", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&q=80" },
  { name: "Home Decor", nameAr: "ديكور المنزل", slug: "home-decor", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80" },
  { name: "Tableware", nameAr: "أدوات المائدة", slug: "tableware", img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80" },
  { name: "Storage & Organization", nameAr: "التخزين والتنظيم", slug: "storage", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80" },
  { name: "Bathroom", nameAr: "الحمام", slug: "bathroom", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
  { name: "Linens & Textiles", nameAr: "المنسوجات", slug: "linens", img: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=400&q=80" },
];

const testimonials = [
  { name: "Sara M.", textKey: "testimonial1", rating: 5 },
  { name: "Ahmed K.", textKey: "testimonial2", rating: 5 },
  { name: "Nour H.", textKey: "testimonial3", rating: 4 },
];

export default function Landing() {
  const { lang, t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => { api.get("/products/featured").then(r => setFeatured(r.data.products)); }, []);
  useEffect(() => { const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000); return () => clearInterval(t); }, []);

  const hero = heroSlides[slide];
  const heroText = t("landing.hero." + hero.key);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#E8D8C9]/70 to-transparent z-10" />
        <div className="max-w-7xl mx-auto relative z-20 flex flex-col md:flex-row items-center min-h-[520px]">
          <div className="flex-1 px-8 py-16 md:py-0">
            <p className="text-secondary font-cairo tracking-[0.3em] uppercase text-xs mb-4 font-semibold">{t("landing.eyebrow")}</p>
            <h1 className="font-cairo text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] whitespace-pre-line">{heroText.title}</h1>
            <p className="text-gray-600 mt-6 text-lg max-w-md leading-relaxed">{heroText.sub}</p>
            <div className="flex gap-4 mt-8">
              <Link to={hero.link} className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-accent transition shadow-lg shadow-[#274B3C]/30">{heroText.cta}</Link>
              <Link to="/products" className="border-2 border-primary text-primary px-8 py-3.5 rounded-full font-semibold hover:bg-accent hover:text-white transition">{t("landing.viewAll")}</Link>
            </div>
            <div className="flex gap-2 mt-8">
              {heroSlides.map((_, i) => (<button key={i} onClick={() => setSlide(i)} className={"w-2.5 h-2.5 rounded-full transition-all " + (i === slide ? "bg-primary w-8" : "bg-gray-300")} />))}
            </div>
          </div>
          <div className="flex-1 relative h-[520px] hidden md:block">
            {heroSlides.map((s, i) => (
              <img key={i} src={s.img} alt="" className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-700 " + (i === slide ? "opacity-100" : "opacity-0")} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FAF9F6]/60" />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between overflow-x-auto gap-8">
          {[
            { icon: "local_shipping", title: t("features.freeDelivery"), desc: t("features.freeDeliveryDesc") },
            { icon: "verified", title: t("features.quality"), desc: t("features.qualityDesc") },
            { icon: "cached", title: t("features.returns"), desc: t("features.returnsDesc") },
            { icon: "support_agent", title: t("features.support"), desc: t("features.supportDesc") },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <span className="material-symbols-outlined text-secondary text-2xl">{f.icon}</span>
              <div><p className="text-sm font-semibold">{f.title}</p><p className="text-xs text-gray-400">{f.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-secondary font-cairo text-sm tracking-widest uppercase">{t("landing.browse")}</p>
          <h2 className="font-cairo text-3xl font-bold mt-1">{t("landing.shopByCategory")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link key={cat.slug} to={"/products?category=" + cat.slug} className="group relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#274B3C]/80 via-[#274B3C]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-cairo font-bold text-white text-sm">{lang === "ar" ? cat.nameAr : cat.name}</h3>
                <p className="text-white/70 text-xs mt-0.5">{lang === "ar" ? cat.name : cat.nameAr}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-secondary font-cairo text-sm tracking-widest uppercase">{t("landing.ourPicks")}</p>
            <h2 className="font-cairo text-3xl font-bold mt-1">{t("landing.featuredProducts")}</h2>
          </div>
          <Link to="/products" className="text-secondary font-semibold text-sm hover:underline flex items-center gap-1">{t("landing.viewAll")} <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-primary rounded-3xl overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            <p className="text-sand font-cairo text-sm tracking-widest uppercase">{t("landing.limitedTime")}</p>
            <h2 className="font-cairo text-3xl md:text-4xl font-bold text-white mt-2 whitespace-pre-line">{t("landing.promoTitle")}</h2>
            <p className="text-gray-400 mt-4 max-w-sm">{t("landing.promoDesc")}</p>
            <Link to="/products?category=kitchen" className="bg-secondary text-white px-8 py-3 rounded-full font-semibold mt-6 inline-block w-fit hover:bg-accent transition">{t("landing.shopTheSale")}</Link>
          </div>
          <div className="flex-1 relative min-h-[250px]">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-secondary font-cairo text-sm tracking-widest uppercase">{t("landing.reviews")}</p>
            <h2 className="font-cairo text-3xl font-bold mt-1">{t("landing.customersSay")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((r, i) => (
              <div key={i} className="bg-warm rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <span key={j} className={"material-symbols-outlined text-sm " + (j < r.rating ? "text-yellow-500" : "text-gray-300")}>star</span>)}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{t("landing." + r.textKey)}</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 bg-sand rounded-full flex items-center justify-center text-xs font-bold text-primary">{r.name[0]}</div>
                  <span className="text-sm font-semibold">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-warm to-sand rounded-3xl p-10 md:p-14 text-center">
          <h2 className="font-cairo text-2xl md:text-3xl font-bold">{t("landing.newsletterTitle")}</h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">{t("landing.newsletterDesc")}</p>
          <div className="flex gap-3 mt-6 max-w-md mx-auto">
            <input type="email" placeholder={t("landing.emailPlaceholder")} className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary bg-white" />
            <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-accent transition">{t("landing.subscribe")}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
