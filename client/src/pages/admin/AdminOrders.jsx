import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";
export default function AdminOrders() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  useEffect(() => { if (user?.role === "admin") fetchOrders(); }, [user, statusFilter]);
  const fetchOrders = () => { setLoading(true); const params = {}; if (statusFilter) params.status = statusFilter; api.get("/orders/admin/all", { params }).then(r => setOrders(r.data?.orders || [])).finally(() => setLoading(false)); };
  const updateStatus = async (orderId, status) => {
    try { await api.put("/orders/" + orderId + "/status", { status }); toast.success("Status updated"); fetchOrders(); }
    catch (e) { toast.error("Failed to update"); }
  };
  const statusColor = (s) => ({ pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", out_for_delivery: "bg-indigo-100 text-indigo-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" }[s] || "bg-gray-100");
  const nextStatus = { pending: "confirmed", confirmed: "processing", processing: "shipped", shipped: "out_for_delivery", out_for_delivery: "delivered" };
  if (user?.role !== "admin") return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p>{t("admin.adminRequired")}</p></div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4"><Link to="/admin" className="text-gray-500 hover:text-primary"><span className="material-symbols-outlined">arrow_back</span></Link><h1 className="font-cairo text-3xl font-bold">{t("admin.orders")}</h1></div>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {["", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={"shrink-0 px-3 py-1 rounded-full text-xs " + (statusFilter === s ? "bg-primary text-white" : "bg-white border")}>{s || t("admin.all")}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      : orders.length === 0 ? <p className="text-gray-500 text-center py-10">{t("admin.noOrders")}</p>
      : (<div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div><p className="font-semibold">#{order.orderNumber}</p><p className="text-sm text-gray-500">{order.user?.firstName} {order.user?.lastName} - {order.user?.email}</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={"text-xs px-3 py-1 rounded-full font-semibold " + statusColor(order.status)}>{order.status.replace("_", " ")}</span>
                {nextStatus[order.status] && <button onClick={() => updateStatus(order.id, nextStatus[order.status])} className="bg-primary text-white text-xs px-3 py-1 rounded-full hover:bg-accent">{t("admin.markAs")} {nextStatus[order.status].replace("_", " ")}</button>}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-sm bg-warm rounded-lg px-3 py-1">
                  <span>{item.productName} x{item.quantity}</span>
                  <span className="font-semibold">EGP {item.total}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{order.address?.street}, {order.address?.city}</span>
              <span className="font-cairo font-bold text-primary">{t("orders.total")} {t("currency")} {order.total}</span>
            </div>
          </div>
        ))}
      </div>)}
    </div>
  );
}
