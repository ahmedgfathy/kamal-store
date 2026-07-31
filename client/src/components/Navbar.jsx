import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { lang, toggle, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const handleSearch = (e) => { e.preventDefault(); if (search.trim()) navigate("/products?search=" + encodeURIComponent(search)); };
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-cairo text-2xl font-bold text-primary">AURUM &amp; CO.</Link>
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-warm rounded-full px-4 py-2 w-80">
            <span className="material-symbols-outlined text-brown mr-2 rtl:ml-2 rtl:mr-0">search</span>
            <input type="text" placeholder={t("nav.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none w-full text-sm" />
          </form>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="hover:text-accent transition">{t("nav.shop")}</Link>
            {user ? (<>
              <Link to="/my-orders" className="hover:text-accent transition">{t("nav.myOrders")}</Link>
              {user.role === "admin" && <Link to="/admin" className="hover:text-accent transition">{t("nav.admin")}</Link>}
              <Link to="/cart" className="relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                {items.length > 0 && <span className="absolute -top-2 -right-2 rtl:-right-auto rtl:-left-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{items.length}</span>}
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sand rounded-full flex items-center justify-center text-sm font-bold text-primary">{user.firstName?.[0]}</div>
                <button onClick={() => { logout(); navigate("/"); }} className="text-sm text-gray-500 hover:text-accent">{t("nav.logout")}</button>
              </div>
            </>) : (<>
              <Link to="/login" className="hover:text-accent transition">{t("nav.login")}</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-accent transition">{t("nav.register")}</Link>
            </>)}
            <button onClick={toggle} className="px-3 py-1.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition">
              {lang === "en" ? "عربي" : "EN"}
            </button>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggle} className="px-3 py-1.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition">
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block hover:text-accent">{t("nav.shop")}</Link>
          {user ? (<>
            <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block hover:text-accent">{t("nav.myOrders")}</Link>
            {user.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block hover:text-accent">{t("nav.admin")}</Link>}
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block hover:text-accent">{t("nav.cart")} ({items.length})</Link>
            <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} className="block text-gray-500 hover:text-accent">{t("nav.logout")}</button>
          </>) : (<>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-accent">{t("nav.login")}</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="block bg-primary text-white px-4 py-2 rounded-full text-center">{t("nav.register")}</Link>
          </>)}
        </div>
      )}
    </nav>
  );
}
