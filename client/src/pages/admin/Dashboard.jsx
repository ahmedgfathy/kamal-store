import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isStaff = ["admin", "editor", "manager"].includes(user?.role);
  const canOrders = ["admin", "manager"].includes(user?.role);
  const canProducts = ["admin", "editor"].includes(user?.role);
  useEffect(() => { if (canOrders) api.get("/orders/stats").then(r => setStats(r.data)).finally(() => setLoading(false)); else setLoading(false); }, [user, canOrders]);
  if (!isStaff) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">{t("admin.adminRequired")}</p></div>;
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  const s = stats?.stats || {};
  const cards = [
    canOrders && { label: t("admin.totalOrders"), value: s.totalOrders, icon: "receipt_long", color: "bg-blue-50 text-blue-600" },
    canOrders && { label: t("admin.pending"), value: s.pendingOrders, icon: "pending", color: "bg-yellow-50 text-yellow-600" },
    canOrders && { label: t("admin.delivered"), value: s.deliveredOrders, icon: "check_circle", color: "bg-green-50 text-green-600" },
    canOrders && { label: t("admin.revenue"), value: t("currency") + " " + (s.totalRevenue || 0).toLocaleString(), icon: "payments", color: "bg-purple-50 text-purple-600" },
    canOrders && { label: t("admin.customers"), value: s.totalCustomers, icon: "people", color: "bg-warm text-primary" },
    canOrders && { label: t("admin.cancelled"), value: s.cancelledOrders, icon: "cancel", color: "bg-red-50 text-red-600" },
  ].filter(Boolean);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-cairo text-3xl font-bold">{t("admin.dashboard")}</h1>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {canProducts && <Link to="/admin/products" className="shrink-0 bg-white border px-4 py-2 rounded-full text-sm hover:bg-warm transition">{t("admin.products")}</Link>}
          {canOrders && <Link to="/admin/orders" className="shrink-0 bg-white border px-4 py-2 rounded-full text-sm hover:bg-warm transition">{t("admin.orders")}</Link>}
          {canOrders && <Link to="/admin/customers" className="shrink-0 bg-white border px-4 py-2 rounded-full text-sm hover:bg-warm transition">{t("admin.customers")}</Link>}
          {user?.role === "admin" && <Link to="/admin/users" className="shrink-0 bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-secondary transition flex items-center gap-1"><span className="material-symbols-outlined text-base">manage_accounts</span>{t("admin.users") || "Users"}</Link>}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className={"rounded-2xl p-4 " + c.color}>
            <span className="material-symbols-outlined text-2xl">{c.icon}</span>
            <p className="text-2xl font-bold mt-2">{c.value}</p>
            <p className="text-xs opacity-70">{c.label}</p>
          </div>
        ))}
      </div>
      {canOrders && <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-cairo font-bold text-lg mb-4">{t("admin.recentOrders")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b"><th className="pb-3">{t("admin.order")}</th><th className="pb-3">{t("admin.customer")}</th><th className="pb-3">{t("admin.total")}</th><th className="pb-3">{t("admin.status")}</th></tr></thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="py-3">{order.orderNumber}</td>
                  <td className="py-3">{order.user?.firstName} {order.user?.lastName}</td>
                  <td className="py-3 font-semibold">{t("currency")} {order.total}</td>
                  <td className="py-3"><span className="px-2 py-1 rounded-full text-xs bg-warm">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}
