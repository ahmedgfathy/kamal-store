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
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  const submitSearch = (e) => { e.preventDefault(); if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearchOpen(false); setMenuOpen(false); } };

  return <>
    <div className="announcement"><span>{lang === "ar" ? "شحن مجاني للطلبات فوق 500 ج.م" : "Free delivery on orders over EGP 500"}</span><span className="announcement__desktop">{lang === "ar" ? "استرجاع سهل خلال 14 يوم" : "Easy 14-day returns"}</span></div>
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Menu"><span className="material-symbols-outlined">menu</span></button>
        <nav className="desktop-nav">
          <Link to="/products">{t("nav.shop")}</Link>
          <Link to="/products?category=kitchen">{lang === "ar" ? "المطبخ" : "Kitchen"}</Link>
          <Link to="/products?category=home-decor">{lang === "ar" ? "الديكور" : "Décor"}</Link>
        </nav>
        <Logo className="site-logo" />
        <div className="header-actions">
          <button onClick={toggle} className="lang-button">{lang === "ar" ? "EN" : "ع"}</button>
          <button onClick={() => setSearchOpen(true)} className="icon-button" aria-label="Search"><span className="material-symbols-outlined">search</span></button>
          {user ? <button className="icon-button desktop-only" onClick={() => { logout(); navigate("/"); }} title={t("nav.logout")}><span className="material-symbols-outlined">person</span></button> : <Link to="/login" className="icon-button desktop-only" aria-label={t("nav.login")}><span className="material-symbols-outlined">person</span></Link>}
          <Link to="/cart" className="icon-button cart-button" aria-label={t("nav.cart")}><span className="material-symbols-outlined">shopping_bag</span>{items.length > 0 && <b>{items.length}</b>}</Link>
        </div>
      </div>
    </header>

    {searchOpen && <div className="search-overlay"><button onClick={() => setSearchOpen(false)} aria-label="Close">×</button><form onSubmit={submitSearch}><label>{t("nav.searchPlaceholder")}</label><div><input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder={t("nav.searchPlaceholder")} /><button type="submit"><span className="material-symbols-outlined">arrow_back</span></button></div></form></div>}

    {menuOpen && <div className="mobile-drawer"><button className="mobile-drawer__backdrop" onClick={() => setMenuOpen(false)} /><aside><div className="mobile-drawer__head"><Logo className="site-logo" /><button onClick={() => setMenuOpen(false)}>×</button></div><nav>
      <Link onClick={() => setMenuOpen(false)} to="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products">{t("nav.shop")}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products?category=kitchen">{lang === "ar" ? "المطبخ" : "Kitchen"}</Link>
      <Link onClick={() => setMenuOpen(false)} to="/products?category=home-decor">{lang === "ar" ? "ديكور المنزل" : "Home décor"}</Link>
      {user && <Link onClick={() => setMenuOpen(false)} to="/my-orders">{t("nav.myOrders")}</Link>}
      {user?.role === "admin" && <Link onClick={() => setMenuOpen(false)} to="/admin">{t("nav.admin")}</Link>}
    </nav><div className="mobile-drawer__account">{user ? <><span>{user.firstName} {user.lastName}</span><button onClick={() => { logout(); setMenuOpen(false); navigate("/"); }}>{t("nav.logout")}</button></> : <><Link to="/login">{t("nav.login")}</Link><Link className="button-primary" to="/register">{t("nav.register")}</Link></>}</div></aside></div>}

    <nav className="mobile-tabbar">
      <Link to="/"><span className="material-symbols-outlined">home</span><small>{lang === "ar" ? "الرئيسية" : "Home"}</small></Link>
      <Link to="/products"><span className="material-symbols-outlined">grid_view</span><small>{t("nav.shop")}</small></Link>
      <Link to="/cart"><span className="material-symbols-outlined">shopping_bag</span><small>{t("nav.cart")}</small>{items.length > 0 && <b>{items.length}</b>}</Link>
      <Link to={user ? "/my-orders" : "/login"}><span className="material-symbols-outlined">person</span><small>{user ? t("nav.myOrders") : t("nav.login")}</small></Link>
    </nav>
  </>;
}
