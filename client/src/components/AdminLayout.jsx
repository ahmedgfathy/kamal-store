import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const L = (ar, en) => (lang === "ar" ? ar : en);

  const nav = [
    { to: "/admin", icon: "dashboard", label: L("لوحة التحكم", "Dashboard"), roles: ["admin", "editor", "manager"], end: true },
    { to: "/admin/products", icon: "inventory_2", label: L("المنتجات", "Products"), roles: ["admin", "editor"] },
    { to: "/admin/orders", icon: "receipt_long", label: L("الطلبات", "Orders"), roles: ["admin", "manager"] },
    { to: "/admin/customers", icon: "people", label: L("العملاء", "Customers"), roles: ["admin", "manager"] },
    { to: "/admin/users", icon: "manage_accounts", label: L("الموظفون والصلاحيات", "Users & Roles"), roles: ["admin"] },
  ].filter(item => item.roles.includes(user?.role));

  const roleLabel = { admin: L("مدير عام", "Super Admin"), manager: L("مدير طلبات", "Manager"), editor: L("محرر منتجات", "Editor") }[user?.role] || "";

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-accent grid place-items-center text-primary"><span className="material-symbols-outlined">home_living</span></span>
          <span><b className="block text-white text-sm leading-tight">{lang === "ar" ? "كمال وحيد" : "Kamal Waheed"}</b><small className="text-accent text-[10px] tracking-widest uppercase">{L("لوحة الإدارة", "Control Panel")}</small></span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)}
            className={({ isActive }) => "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition " + (isActive ? "bg-accent text-primary shadow-lg shadow-accent/20" : "text-white/70 hover:bg-white/10 hover:text-white")}>
            <span className="material-symbols-outlined text-[21px]">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white transition"><span className="material-symbols-outlined text-[21px]">storefront</span>{L("عرض المتجر", "View store")}</Link>
        <button onClick={() => { logout(); navigate("/login"); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-300 hover:bg-red-500/15 transition"><span className="material-symbols-outlined text-[21px]">logout</span>{t("nav.logout")}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F6FA]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <aside className="hidden lg:flex fixed inset-y-0 inset-inline-start-0 w-64 bg-gradient-to-b from-primary via-[#0A2438] to-[#071A2B] flex-col z-40" style={{ insetInlineStart: 0 }}>{sidebar}</aside>
      {open && <div className="lg:hidden fixed inset-0 z-[100]"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 inset-inline-start-0 w-72 bg-gradient-to-b from-primary via-[#0A2438] to-[#071A2B]" style={{ insetInlineStart: 0 }}>{sidebar}</aside></div>}
      <div className="lg:ms-64">
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-line flex items-center gap-3 px-4 sm:px-6 h-16">
          <button className="lg:hidden icon-button" onClick={() => setOpen(true)} aria-label="Menu"><span className="material-symbols-outlined">menu</span></button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-end hidden sm:block">
              <p className="text-sm font-bold leading-tight">{user?.firstName} {user?.lastName}</p>
              <p className="text-[11px] text-secondary font-bold">{roleLabel}</p>
            </div>
            <span className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center font-bold">{(user?.firstName || "U")[0]}</span>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
