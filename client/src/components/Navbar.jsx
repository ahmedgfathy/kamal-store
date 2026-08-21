import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { lang, toggle, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  const submitSearch = (e) => { e.preventDefault(); if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearchOpen(false); setMenuOpen(false); } };

  const desktopLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.newArrivals") },
    { to: "/products?filter=best", label: t("nav.bestSellers") },
    { to: "/products?category=kitchen", label: t("nav.kitchen") },
    { to: "/products?category=home-decor", label: t("nav.decor") },
    { to: "/products?filter=sale", label: t("nav.sale"), badge: true },
  ];

  return <>
    <div className="announcement">
      <span>{t("promo.annTop")}</span>
      <span className="announcement__desktop">{t("promo.annBottom")}</span>
    </div>
    <header className={"site-header" + (scrolled ? " site-header--scrolled" : "")}>
      <div className="site-header__inner page-shell">
        <div className="site-header__brand">
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Menu"><span className="material-symbols-outlined">menu</span></button>
          <Logo className="site-logo" />
        </div>
        <nav className="desktop-nav" aria-label="Main">
          {desktopLinks.map((link) => (
            <Link key={link.label} to={link.to} className={link.badge ? "nav-link nav-link--sale" : "nav-link"}>{link.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          {["admin", "editor", "manager"].includes(user?.role) && <Link to="/admin" className="hidden md:inline-flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-secondary transition" title="Control Panel"><span className="material-symbols-outlined text-base">admin_panel_settings</span>{t("nav.admin")}</Link>}
          <button onClick={toggle} className="lang-button">{lang === "ar" ? "EN" : "ع"}</button>
          <button onClick={() => setSearchOpen(true)} className="icon-button desktop-only" aria-label="Search"><span className="material-symbols-outlined">search</span></button>
          {user ? <Link to="/profile" className="icon-button desktop-only" title={t("profile.title")}><span className="material-symbols-outlined">person</span></Link> : <Link to="/login" className="icon-button desktop-only" aria-label={t("nav.login")}><span className="material-symbols-outlined">person</span></Link>}
          <Link to="/cart" className="icon-button cart-button" aria-label={t("nav.cart")}><span className="material-symbols-outlined">shopping_bag</span>{items.length > 0 && <b>{items.length}</b>}</Link>
        </div>
      </div>
    </header>

    {searchOpen && <div className="search-overlay"><button onClick={() => setSearchOpen(false)} aria-label="Close">×</button><form onSubmit={submitSearch}><label>{t("nav.searchPlaceholder")}</label><div><input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder={t("nav.searchPlaceholder")} /><button type="submit"><span className="material-symbols-outlined">arrow_back</span></button></div></form></div>}

    {menuOpen && <div className="mobile-drawer"><button className="mobile-drawer__backdrop" onClick={() => setMenuOpen(false)} /><aside><div className="mobile-drawer__head"><Logo className="site-logo" /><button onClick={() => setMenuOpen(false)}>×</button></div><nav>
      <button className="mobile-drawer__search" onClick={() => { setSearchOpen(true); setMenuOpen(false); }}><span className="material-symbols-outlined">search</span>{t("nav.searchPlaceholder")}</button>
      <Link onClick={() => setMenuOpen(false)} to="/">{t("nav.home")}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products">{t("nav.newArrivals")}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products?filter=best">{t("nav.bestSellers")}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products?filter=sale">{t("nav.sale")}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products?category=kitchen">{t("nav.kitchen")}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products?category=home-decor">{t("nav.decor")}</Link>
      {user && <Link onClick={() => setMenuOpen(false)} to="/my-orders">{t("nav.myOrders")}</Link>}
      {user && <Link onClick={() => setMenuOpen(false)} to="/profile">{t("profile.title")}</Link>}
      {["admin", "editor", "manager"].includes(user?.role) && <Link onClick={() => setMenuOpen(false)} to="/admin">{t("nav.admin")}</Link>}
    </nav><div className="mobile-drawer__account">{user ? <><Link onClick={() => setMenuOpen(false)} to="/profile">{t("profile.title")}</Link><button onClick={() => { logout(); setMenuOpen(false); navigate("/"); }}>{t("nav.logout")}</button></> : <><Link to="/login">{t("nav.login")}</Link><Link className="button-primary" to="/register">{t("nav.register")}</Link></>}</div></aside></div>}

    <nav className="mobile-tabbar">
      <Link to="/"><span className="material-symbols-outlined">home</span><small>{t("nav.home")}</small></Link>
      <Link to="/products"><span className="material-symbols-outlined">grid_view</span><small>{t("nav.shop")}</small></Link>
      <Link to="/products?filter=sale"><span className="material-symbols-outlined">local_offer</span><small>{t("nav.sale")}</small></Link>
      <Link to={user ? "/profile" : "/login"}><span className="material-symbols-outlined">person</span><small>{user ? t("nav.myOrders") : t("nav.login")}</small></Link>
    </nav>
  </>;
}