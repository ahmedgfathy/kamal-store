import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
export default function AdminCustomers() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  useEffect(() => { if (user?.role === "admin") api.get("/orders/admin/customers").then(r => { setCustomers(r.data.customers); setPagination(r.data.pagination); }).finally(() => setLoading(false)); }, [user]);
  if (user?.role !== "admin") return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p>{t("admin.adminRequired")}</p></div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8"><Link to="/admin" className="text-gray-500 hover:text-primary"><span className="material-symbols-outlined">arrow_back</span></Link><h1 className="font-cairo text-3xl font-bold">{t("admin.customers")}</h1></div>
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      : (<div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="p-4">{t("admin.customerCol")}</th><th className="p-4">{t("admin.email")}</th><th className="p-4">{t("admin.phone")}</th><th className="p-4">{t("admin.ordersCol")}</th><th className="p-4">{t("admin.totalSpent")}</th><th className="p-4">{t("admin.joined")}</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b hover:bg-warm">
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-sand rounded-full flex items-center justify-center text-xs font-bold text-primary">{c.firstName?.[0]}</div><span className="font-semibold">{c.firstName} {c.lastName}</span></div></td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone || "-"}</td>
                <td className="p-4">{c.orders?.length || 0}</td>
                <td className="p-4">{t("currency")} {(c.orders || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0).toFixed(2)}</td>
                <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}
    </div>
  );
}
