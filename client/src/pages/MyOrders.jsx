import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
export default function MyOrders() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (user) api.get("/orders").then(r => setOrders(r.data?.orders || [])).finally(() => setLoading(false)); }, [user]);
  const statusColor = (s) => ({ pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", out_for_delivery: "bg-indigo-100 text-indigo-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" }[s] || "bg-gray-100");
  if (!user) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">{t("orders.loginToView")}</p><Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full mt-4 inline-block">{t("orders.login")}</Link></div>;
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-cairo text-3xl font-bold mb-8">{t("orders.title")}</h1>
      {orders.length === 0 ? (<div className="text-center py-16"><span className="material-symbols-outlined text-6xl text-gray-300">receipt_long</span><p className="text-gray-500 mt-4">{t("orders.empty")}</p><Link to="/products" className="bg-primary text-white px-6 py-2 rounded-full mt-4 inline-block">{t("orders.startShopping")}</Link></div>)
      : orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-sm text-gray-500">{t("orders.orderNo")}{order.orderNumber}</p><p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</p></div>
            <span className={"text-xs px-3 py-1 rounded-full font-semibold " + statusColor(order.status)}>{order.status.replace("_", " ")}</span>
          </div>
          <div className="space-y-2 mb-3">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img src={item.productImage || "/placeholder.svg"} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                <span className="flex-1">{item.productName} x{item.quantity}</span>
                <span className="font-semibold">{t("currency")} {item.total}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-cairo font-bold text-primary">{t("orders.total")} {t("currency")} {order.total}</span>
            {["pending", "confirmed"].includes(order.status) && (
              <button onClick={async () => { await api.put("/orders/" + order.id + "/cancel"); setOrders(orders.map(o => o.id === order.id ? { ...o, status: "cancelled" } : o)); }} className="text-red-500 text-sm hover:underline">{t("orders.cancelOrder")}</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
