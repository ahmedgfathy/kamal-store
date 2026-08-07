import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: "", fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "Egypt" });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get("/auth/addresses").then(r => setAddresses(r.data?.addresses || [])).catch(() => toast.error("Failed to load addresses")).finally(() => setLoading(false));
  }, [user, navigate]);

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/auth/addresses", form);
      setAddresses([...addresses, res.data.address]);
      setForm({ label: "", fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "Egypt" });
      toast.success(t("profile.added"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      await api.delete("/auth/addresses/" + id);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success(t("profile.deleted"));
    } catch { toast.error("Failed to delete address"); }
  };

  if (!user) return null;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-cairo text-3xl font-bold">{t("profile.title")}</h1>
          <p className="text-gray-500 mt-1">{user.firstName} {user.lastName} · {user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/my-orders" className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm hover:bg-warm transition">{t("profile.orders")}</Link>
          <button onClick={() => { logout(); navigate("/"); }} className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-full text-sm hover:bg-red-50 transition">{t("profile.logout")}</button>
        </div>
      </div>

      <h2 className="font-cairo font-bold text-lg mb-4">{t("profile.addresses")}</h2>
      {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl py-12 text-center border border-line"><span className="material-symbols-outlined text-5xl text-gray-300">home</span><p className="text-gray-500 mt-3">{t("profile.noAddresses")}</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold flex items-center gap-2">{addr.fullName} - {addr.label}{addr.isDefault && <span className="text-xs px-2 py-0.5 rounded-full bg-warm text-primary">{t("profile.default")}</span>}</p>
                <button onClick={() => handleDelete(addr.id)} className="text-red-400 hover:text-red-600" aria-label={t("profile.deleteAddress")}><span className="material-symbols-outlined">delete</span></button>
              </div>
              <p className="text-sm text-gray-500 mt-2">{addr.street}, {addr.city}{addr.state ? ", " + addr.state : ""}, {addr.country}</p>
              <p className="text-sm text-gray-500">{addr.phone}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <h3 className="font-cairo font-bold text-lg sm:col-span-2">{t("profile.addAddress")}</h3>
        <input placeholder={t("profile.label") + " *"} value={form.label} onChange={e => update("label", e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.fullName") + " *"} value={form.fullName} onChange={e => update("fullName", e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.phone") + " *"} type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.street") + " *"} value={form.street} onChange={e => update("street", e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.city") + " *"} value={form.city} onChange={e => update("city", e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.state")} value={form.state} onChange={e => update("state", e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.zipCode")} value={form.zipCode} onChange={e => update("zipCode", e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <input placeholder={t("profile.country")} value={form.country} onChange={e => update("country", e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-accent transition disabled:opacity-50">{saving ? t("profile.saving") : t("profile.save")}</button>
        </div>
      </form>
    </div>
  );
}