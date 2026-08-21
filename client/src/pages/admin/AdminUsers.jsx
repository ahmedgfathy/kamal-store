import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const ROLES = ["customer", "editor", "manager", "admin"];

export default function AdminUsers() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // {mode:"add"} | {mode:"edit", user}
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const L = (ar, en) => (lang === "ar" ? ar : en);

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (roleFilter) params.role = roleFilter;
    if (search.trim()) params.search = search.trim();
    api.get("/users", { params }).then(r => setUsers(r.data?.users || [])).finally(() => setLoading(false));
  };
  useEffect(() => { if (user?.role === "admin") fetchUsers(); }, [user, roleFilter]);

  if (user?.role !== "admin") return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p>{t("admin.adminRequired")}</p></div>;

  const openAdd = () => { setForm({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "editor" }); setError(""); setModal({ mode: "add" }); };
  const openEdit = (u) => { setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone || "", role: u.role, isActive: u.isActive, password: "" }); setError(""); setModal({ mode: "edit", user: u }); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (modal.mode === "add") await api.post("/users", form);
      else {
        const patch = { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, role: form.role, isActive: form.isActive };
        if (form.password) patch.password = form.password;
        await api.put(`/users/${modal.user.id}`, patch);
      }
      setModal(null); fetchUsers();
    } catch (err) { setError(err.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  const toggleActive = async (u) => {
    if (!confirm(L(`تعطيل حساب ${u.email}؟`, `Deactivate ${u.email}?`))) return;
    try { await api.delete(`/users/${u.id}`); fetchUsers(); } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const roleBadge = (role) => ({
    admin: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    editor: "bg-green-100 text-green-700",
    customer: "bg-warm text-stone",
  }[role]);
  const roleName = (role) => ({ admin: L("مدير عام", "Admin"), manager: L("مدير طلبات", "Manager"), editor: L("محرر منتجات", "Editor"), customer: L("عميل", "Customer") }[role]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cairo text-3xl font-bold">{L("إدارة المستخدمين والصلاحيات", "Users & Permissions")}</h1>
          <p className="text-sm text-gray-500 mt-1">{L("أضف موظفين وحدد صلاحياتهم حسب الدور", "Add employees and assign role-based permissions")}</p>
        </div>
        <button onClick={openAdd} className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-secondary transition flex items-center gap-2"><span className="material-symbols-outlined text-xl">person_add</span>{L("إضافة موظف", "Add employee")}</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[["", L("الكل", "All")], ["admin", L("مدير عام", "Admin")], ["manager", L("مدير طلبات", "Manager")], ["editor", L("محرر", "Editor")], ["customer", L("عملاء", "Customers")]].map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)} className={"shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm border transition " + (roleFilter === val ? "bg-primary text-white border-primary" : "bg-white border-line hover:border-secondary")}>{label}</button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); fetchUsers(); }} className="flex gap-2 sm:ms-auto">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={L("بحث بالاسم أو البريد…", "Search name or email…")} className="border border-line rounded-full px-4 py-2 text-sm bg-white w-full sm:w-64" />
          <button type="submit" className="bg-white border border-line px-4 rounded-full text-sm hover:bg-warm"><span className="material-symbols-outlined text-xl">search</span></button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead><tr className="text-start text-gray-500 border-b bg-warm/50">
            <th className="p-4 text-start">{L("الاسم", "Name")}</th><th className="p-4 text-start">{L("البريد", "Email")}</th><th className="p-4 text-start">{L("الدور", "Role")}</th><th className="p-4 text-start">{L("الحالة", "Status")}</th><th className="p-4 text-start">{L("إجراءات", "Actions")}</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-10 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
            : users.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-warm/30">
                <td className="p-4 font-semibold">{u.firstName} {u.lastName}{u.id === user.id && <span className="text-xs text-secondary ms-2">({L("أنت", "you")})</span>}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4"><span className={"px-3 py-1 rounded-full text-xs font-bold " + roleBadge(u.role)}>{roleName(u.role)}</span></td>
                <td className="p-4">{u.isActive ? <span className="text-green-600 text-xs font-bold">● {L("نشط", "Active")}</span> : <span className="text-red-500 text-xs font-bold">● {L("معطل", "Disabled")}</span>}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(u)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-warm" title={L("تعديل", "Edit")}><span className="material-symbols-outlined text-lg">edit</span></button>
                    {u.id !== user.id && <button onClick={() => toggleActive(u)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-red-50 text-red-500" title={L("تعطيل", "Deactivate")}><span className="material-symbols-outlined text-lg">person_off</span></button>}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !users.length && <tr><td colSpan="5" className="p-10 text-center text-gray-400">{L("لا يوجد مستخدمون", "No users found")}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-cairo font-bold mb-3">{L("الأدوار والصلاحيات", "Roles & permissions")}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="rounded-xl p-4 bg-purple-50"><b className="text-purple-700">{L("مدير عام", "Admin")}</b><p className="text-gray-600 mt-1">{L("كل الصلاحيات: المنتجات، الطلبات، العملاء، والموظفين", "Full access: products, orders, customers and employees")}</p></div>
          <div className="rounded-xl p-4 bg-green-50"><b className="text-green-700">{L("محرر منتجات", "Editor")}</b><p className="text-gray-600 mt-1">{L("إضافة وتعديل وحذف المنتجات والأقسام", "Add, edit and delete products & categories")}</p></div>
          <div className="rounded-xl p-4 bg-blue-50"><b className="text-blue-700">{L("مدير طلبات", "Manager")}</b><p className="text-gray-600 mt-1">{L("متابعة الطلبات وتحديث حالتها وإدارة العملاء", "Follow orders, update status, manage customers")}</p></div>
          <div className="rounded-xl p-4 bg-warm"><b className="text-primary">{L("عميل", "Customer")}</b><p className="text-gray-600 mt-1">{L("التسوق والشراء فقط", "Shopping and purchasing only")}</p></div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <form onSubmit={submit} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-cairo text-xl font-bold mb-4">{modal.mode === "add" ? L("إضافة موظف جديد", "Add new employee") : L("تعديل المستخدم", "Edit user")}</h3>
            {error && <p className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold text-gray-500">{L("الاسم الأول", "First name")}<input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm font-normal" /></label>
              <label className="text-xs font-bold text-gray-500">{L("اسم العائلة", "Last name")}<input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm font-normal" /></label>
            </div>
            <label className="block text-xs font-bold text-gray-500 mt-3">{L("البريد الإلكتروني", "Email")}<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm font-normal" /></label>
            <label className="block text-xs font-bold text-gray-500 mt-3">{L("رقم الهاتف", "Phone")}<input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm font-normal" dir="ltr" /></label>
            <label className="block text-xs font-bold text-gray-500 mt-3">{L("كلمة المرور", "Password")}
              <input required={modal.mode === "add"} type="password" minLength={8} value={form.password || ""} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={modal.mode === "edit" ? L("اتركها فارغة لعدم التغيير", "Leave blank to keep current") : ""} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm font-normal" />
            </label>
            <label className="block text-xs font-bold text-gray-500 mt-3">{L("الدور / الصلاحية", "Role / permission")}
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-sm font-normal bg-white">
                {ROLES.map(r => <option key={r} value={r}>{roleName(r)}</option>)}
              </select>
            </label>
            {modal.mode === "edit" && (
              <label className="flex items-center gap-2 mt-4 text-sm font-bold">
                <input type="checkbox" checked={!!form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary" />
                {L("الحساب نشط", "Account active")}
              </label>
            )}
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="flex-1 bg-primary text-white rounded-full py-2.5 text-sm font-bold hover:bg-secondary transition disabled:opacity-50">{saving ? "…" : L("حفظ", "Save")}</button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 bg-warm rounded-full py-2.5 text-sm font-bold hover:bg-line transition">{L("إلغاء", "Cancel")}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
