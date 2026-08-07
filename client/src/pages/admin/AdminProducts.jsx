import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";
export default function AdminProducts() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", nameAr: "", slug: "", description: "", price: "", comparePrice: "", stock: "", categoryId: "", sku: "", isFeatured: false });
  useEffect(() => { if (user?.role === "admin") { api.get("/products?limit=100").then(r => setProducts(r.data?.products || [])); api.get("/products/categories").then(r => setCategories(r.data?.categories || [])).finally(() => setLoading(false)); } }, [user]);
  const update = (k, v) => setForm({ ...form, [k]: v });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post("/products", { ...form, price: parseFloat(form.price), comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null, stock: parseInt(form.stock || 0) }); toast.success("Product created"); setShowForm(false); setForm({ name: "", nameAr: "", slug: "", description: "", price: "", comparePrice: "", stock: "", categoryId: "", sku: "", isFeatured: false }); api.get("/products?limit=100").then(r => setProducts(r.data?.products || [])); }
    catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await api.delete("/products/" + id); toast.success("Deleted"); setProducts(products.filter(p => p.id !== id)); }
    catch (e) { toast.error("Failed"); }
  };
  if (user?.role !== "admin") return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p>{t("admin.adminRequired")}</p></div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4"><Link to="/admin" className="text-gray-500 hover:text-primary"><span className="material-symbols-outlined">arrow_back</span></Link><h1 className="font-cairo text-3xl font-bold">{t("admin.products")}</h1></div>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-accent">{showForm ? t("admin.cancel") : t("admin.addProduct")}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-2 gap-4">
          <input placeholder={t("admin.name")} value={form.name} onChange={(e) => update("name", e.target.value)} required className="border rounded-xl px-4 py-2 text-sm" />
          <input placeholder={t("admin.nameAr")} value={form.nameAr} onChange={(e) => update("nameAr", e.target.value)} className="border rounded-xl px-4 py-2 text-sm" />
          <input placeholder={t("admin.slug")} value={form.slug} onChange={(e) => update("slug", e.target.value)} required className="border rounded-xl px-4 py-2 text-sm" />
          <input placeholder={t("admin.sku")} value={form.sku} onChange={(e) => update("sku", e.target.value)} className="border rounded-xl px-4 py-2 text-sm" />
          <input placeholder={t("admin.price")} type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required className="border rounded-xl px-4 py-2 text-sm" />
          <input placeholder={t("admin.comparePrice")} type="number" value={form.comparePrice} onChange={(e) => update("comparePrice", e.target.value)} className="border rounded-xl px-4 py-2 text-sm" />
          <input placeholder={t("admin.stock")} type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} className="border rounded-xl px-4 py-2 text-sm" />
          <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="border rounded-xl px-4 py-2 text-sm"><option value="">{t("admin.selectCategory")}</option>{categories.map(c => <option key={c.id} value={c.id}>{lang === "ar" ? c.nameAr || c.name : c.name}</option>)}</select>
          <textarea placeholder={t("admin.description")} value={form.description} onChange={(e) => update("description", e.target.value)} className="border rounded-xl px-4 py-2 text-sm col-span-2" rows={2} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> {t("admin.featured")}</label>
          <div className="col-span-2"><button type="submit" className="bg-primary text-white px-6 py-2 rounded-full text-sm hover:bg-accent">{t("admin.createProduct")}</button></div>
        </form>
      )}
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      : (<div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="p-4">{t("admin.productCol")}</th><th className="p-4">{t("admin.price")}</th><th className="p-4">{t("admin.stock")}</th><th className="p-4">{t("admin.selectCategory")}</th><th className="p-4">{t("admin.actions")}</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-warm">
                <td className="p-4"><div className="flex items-center gap-3"><img src={p.images?.[0] || "/placeholder.jpg"} className="w-10 h-10 rounded-lg object-cover" /><span className="font-semibold">{lang === "ar" && p.nameAr ? p.nameAr : p.name}</span></div></td>
                <td className="p-4">{t("currency")} {p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.category ? (lang === "ar" ? p.category.nameAr || p.category.name : p.category.name) : "-"}</td>
                <td className="p-4"><button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700"><span className="material-symbols-outlined text-sm">delete</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}
    </div>
  );
}
