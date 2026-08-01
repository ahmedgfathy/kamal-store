import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";
import Logo from "./Logo";
export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { lang, toggle, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e) => { e.preventDefault(); if (search.trim()) { navigate("/products?search=" + encodeURIComponent(search)); setMenuOpen(false); } };
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`bg-cream/95 backdrop-blur-md sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-md border-b border-line" : "border-b border-line/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - responsive sizing */}
            <Logo className="w-28 sm:w-36 md:w-40 shrink-0" />

            {/* Search - desktop only */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-porcelain border border-line rounded-full px-4 py-2 w-72 xl:w-80 focus-within:border-secondary transition">
              <span className="material-symbols-outlined text-stone text-lg mr-2">search</span>
              <input type="text" placeholder={t("nav.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none w-full text-sm text-primary placeholder:text-stone" />
            </form>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-5">
              <Link to="/products" className="text-sm font-medium text-primary hover:text-secondary transition">{t("nav.shop")}</Link>
              {user ? (<>
                <Link to="/my-orders" className="text-sm font-medium text-primary hover:text-secondary transition">{t("nav.myOrders")}</Link>
                {user.role === "admin" && <Link to="/admin" className="text-sm font-medium text-primary hover:text-secondary transition">{t("nav.admin")}</Link>}
                <Link to="/cart" className="relative p-2">
                  <span className="material-symbols-outlined text-xl text-primary">shopping_cart</span>
                  {items.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-gold text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">{items.length}</span>}
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-line">
                  <div className="w-8 h-8 bg-porcelain border border-line rounded-full flex items-center justify-center text-xs font-bold text-primary">{user.firstName?.[0]}</div>
                  <button onClick={() => { logout(); navigate("/"); }} className="text-xs text-stone hover:text-secondary transition">{t("nav.logout")}</button>
                </div>
              </>) : (<>
                <Link to="/login" className="text-sm font-medium text-primary hover:text-secondary transition">{t("nav.login")}</Link>
                <Link to="/register" className="bg-primary text-cream text-sm font-semibold px-5 py-2 rounded-full hover:bg-accent transition">{t("nav.register")}</Link>
              </>)}
              <button onClick={toggle} className="ml-1 px-3 py-1.5 rounded-full border border-secondary text-secondary text-xs font-semibold hover:bg-secondary hover:text-cream transition">
                {lang === "en" ? "عربي" : "EN"}
              </button>
            </div>

            {/* Mobile: lang toggle + hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={toggle} className="px-2.5 py-1 rounded-full border border-secondary text-secondary text-[11px] font-semibold hover:bg-secondary hover:text-cream transition">
                {lang === "en" ? "عربي" : "EN"}
              </button>
              <Link to="/cart" className="relative p-2">
                <span className="material-symbols-outlined text-xl text-primary">shopping_cart</span>
                {items.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-gold text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{items.length}</span>}
              </Link>
              <button onClick={() => setMenuOpen(true)} className="p-2 -mr-1">
                <span className="material-symbols-outlined text-2xl text-primary">menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={closeMenu} />

          {/* Slide panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-cream shadow-2xl flex flex-col animate-slide-in">
            {/* Menu header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <Logo className="w-28" />
              <button onClick={closeMenu} className="p-2 -mr-1">
                <span className="material-symbols-outlined text-2xl text-primary">close</span>
              </button>
            </div>

            {/* Search (mobile) */}
            <form onSubmit={handleSearch} className="px-5 py-3 border-b border-line">
              <div className="flex items-center bg-porcelain border border-line rounded-full px-4 py-2.5 focus-within:border-secondary transition">
                <span className="material-symbols-outlined text-stone text-lg mr-2">search</span>
                <input type="text" placeholder={t("nav.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none w-full text-sm text-primary placeholder:text-stone" />
              </div>
            </form>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-3">
              <Link to="/products" onClick={closeMenu} className="flex items-center gap-3 px-5 py-3 text-primary font-medium hover:bg-porcelain transition">
                <span className="material-symbols-outlined text-xl text-secondary">storefront</span>
                {t("nav.shop")}
              </Link>
              {user ? (<>
                <Link to="/my-orders" onClick={closeMenu} className="flex items-center gap-3 px-5 py-3 text-primary font-medium hover:bg-porcelain transition">
                  <span className="material-symbols-outlined text-xl text-secondary">receipt_long</span>
                  {t("nav.myOrders")}
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={closeMenu} className="flex items-center gap-3 px-5 py-3 text-primary font-medium hover:bg-porcelain transition">
                    <span className="material-symbols-outlined text-xl text-secondary">admin_panel_settings</span>
                    {t("nav.admin")}
                  </Link>
                )}
                <div className="px-5 py-3 mt-2 border-t border-line">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-porcelain border border-line rounded-full flex items-center justify-center text-sm font-bold text-primary">{user.firstName?.[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{user.firstName}</p>
                      <p className="text-xs text-stone">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => { logout(); navigate("/"); closeMenu(); }} className="flex items-center gap-3 w-full px-5 py-3 mt-2 border-t border-line text-stone font-medium hover:text-secondary transition">
                  <span className="material-symbols-outlined text-xl">logout</span>
                  {t("nav.logout")}
                </button>
              </>) : (<>
                <div className="px-5 py-4 mt-2 border-t border-line space-y-3">
                  <Link to="/login" onClick={closeMenu} className="block w-full text-center bg-primary text-cream py-3 rounded-full font-semibold hover:bg-accent transition">{t("nav.login")}</Link>
                  <Link to="/register" onClick={closeMenu} className="block w-full text-center border-2 border-primary text-primary py-3 rounded-full font-semibold hover:bg-primary hover:text-cream transition">{t("nav.register")}</Link>
                </div>
              </>)}
            </div>

            {/* Menu footer */}
            <div className="px-5 py-4 border-t border-line text-center">
              <p className="text-[10px] text-stone tracking-wider uppercase">{t("landing.tagline")}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
