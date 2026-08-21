import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { AreaChart, BarChart, DonutChart } from "../../components/Charts";

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isStaff = ["admin", "editor", "manager"].includes(user?.role);
  const canOrders = ["admin", "manager"].includes(user?.role);
  useEffect(() => {
    if (canOrders) api.get("/orders/stats").then(r => setStats(r.data)).finally(() => setLoading(false));
    else setLoading(false);
  }, [user, canOrders]);
  if (!isStaff) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">{t("admin.adminRequired")}</p></div>;
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const L = (ar, en) => (lang === "ar" ? ar : en);
  const s = stats?.stats || {};
  const fmt = (v) => (typeof v === "number" ? v.toLocaleString() : v);
  const cards = [
    canOrders && { label: L("إجمالي الإيرادات", "Total revenue"), value: t("currency") + " " + fmt(s.totalRevenue || 0), icon: "payments", color: "from-primary to-secondary text-white" },
    canOrders && { label: L("إجمالي الطلبات", "Total orders"), value: fmt(s.totalOrders), icon: "receipt_long", color: "bg-white" },
    canOrders && { label: L("قيد الانتظار", "Pending"), value: fmt(s.pendingOrders), icon: "pending", color: "bg-white" },
    canOrders && { label: L("تم التسليم", "Delivered"), value: fmt(s.deliveredOrders), icon: "check_circle", color: "bg-white" },
    canOrders && { label: L("العملاء", "Customers"), value: fmt(s.totalCustomers), icon: "people", color: "bg-white" },
    canOrders && { label: L("ملغي / مرتجع", "Cancelled"), value: fmt(s.cancelledOrders), icon: "cancel", color: "bg-white" },
  ].filter(Boolean);
  const statusLabels = { pending: L("قيد الانتظار", "pending"), confirmed: L("مؤكد", "confirmed"), processing: L("جاري التجهيز", "processing"), shipped: L("تم الشحن", "shipped"), out_for_delivery: L("خرج للتوصيل", "out for delivery"), delivered: L("تم التسليم", "delivered"), cancelled: L("ملغي", "cancelled"), returned: L("مرتجع", "returned") };
  const maxCatRevenue = Math.max(...(stats?.salesByCategory || []).map(c => c.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cairo text-2xl sm:text-3xl font-bold">{L("مرحباً", "Welcome back")}, {user?.firstName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">{L("نظرة عامة على أداء المتجر اليوم", "Here's what's happening in your store today")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <div key={i} className={`rounded-2xl p-4 shadow-sm border border-line ${c.color} ${i === 0 ? "col-span-2 md:col-span-1 bg-gradient-to-br" : ""}`}>
            <span className={`material-symbols-outlined text-xl ${i === 0 ? "" : "text-secondary"}`}>{c.icon}</span>
            <p className="text-lg sm:text-xl font-extrabold mt-2 truncate">{c.value}</p>
            <p className={`text-[11px] mt-0.5 ${i === 0 ? "text-white/70" : "text-gray-400"}`}>{c.label}</p>
          </div>
        ))}
      </div>

      {canOrders && (
        <>
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-line">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cairo font-bold">{L("الإيرادات — آخر ١٤ يوم", "Revenue — last 14 days")}</h3>
                <span className="text-xs font-bold text-secondary bg-accent/10 px-3 py-1 rounded-full">{t("currency")} {fmt(Math.round((stats?.revenueByDay || []).reduce((a, d) => a + d.value, 0)))}</span>
              </div>
              <AreaChart data={stats?.revenueByDay || []} format={(v) => `${Math.round(v).toLocaleString()} ${t("currency")}`} />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-line">
              <h3 className="font-cairo font-bold mb-4">{L("حالات الطلبات", "Order statuses")}</h3>
              <DonutChart data={(stats?.statusCounts || []).map(d => ({ ...d, label: statusLabels[d.label] || d.label }))} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-line">
              <h3 className="font-cairo font-bold mb-4">{L("عدد الطلبات يومياً — آخر ١٤ يوم", "Daily orders — last 14 days")}</h3>
              <BarChart data={stats?.ordersByDay || []} />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-line">
              <h3 className="font-cairo font-bold mb-4">{L("الإيرادات حسب القسم", "Revenue by category")}</h3>
              <div className="space-y-3">
                {(stats?.salesByCategory || []).map(c => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs mb-1"><span className="font-bold">{lang === "ar" ? c.name_ar : c.name}</span><span className="text-gray-500">{t("currency")} {fmt(Math.round(c.revenue))}</span></div>
                    <div className="h-2.5 bg-warm rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-line">
              <h3 className="font-cairo font-bold mb-4">{L("الأكثر مبيعاً", "Top selling products")}</h3>
              <div className="space-y-3">
                {(stats?.topProducts || []).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${i === 0 ? "bg-primary text-white" : "bg-warm text-primary"}`}>{i + 1}</span>
                    <span className="flex-1 text-sm font-bold truncate">{p.name}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{p.sold} {L("قطعة", "sold")}</span>
                    <span className="text-xs font-bold text-secondary whitespace-nowrap">{t("currency")} {fmt(Math.round(p.revenue))}</span>
                  </div>
                ))}
                {!stats?.topProducts?.length && <p className="text-sm text-gray-400">{L("لا توجد مبيعات بعد", "No sales yet")}</p>}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-line">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cairo font-bold">{t("admin.recentOrders")}</h3>
                <Link to="/admin/orders" className="text-xs font-bold text-secondary hover:underline">{L("عرض الكل", "View all")} ←</Link>
              </div>
              <div className="space-y-2.5">
                {(stats?.recentOrders || []).map(o => (
                  <div key={o.id} className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-xs bg-warm px-2 py-1 rounded-lg">{o.orderNumber}</span>
                    <span className="flex-1 truncate text-gray-600">{o.user?.firstName} {o.user?.lastName}</span>
                    <span className="font-bold whitespace-nowrap">{t("currency")} {fmt(Number(o.total))}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-accent/10 text-primary capitalize whitespace-nowrap">{statusLabels[o.status] || o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!canOrders && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-line text-center">
          <span className="material-symbols-outlined text-5xl text-secondary">inventory_2</span>
          <h3 className="font-cairo font-bold text-lg mt-3">{L("أهلاً بك أيها المحرر", "Welcome, Editor")}</h3>
          <p className="text-sm text-gray-500 mt-1">{L("صلاحياتك تسمح بإدارة المنتجات والأقسام.", "Your role lets you manage products and categories.")}</p>
          <Link to="/admin/products" className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-secondary transition">{L("إدارة المنتجات", "Manage products")}</Link>
        </div>
      )}
    </div>
  );
}
