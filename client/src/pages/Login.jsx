import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await login(email, password); toast.success(t("auth.welcomeBackToast")); navigate("/"); }
    catch (err) { toast.error(err.response?.data?.message || t("auth.loginFailed")); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="font-cairo text-2xl font-bold text-center mb-6">{t("auth.welcomeBack")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium text-gray-600">{t("auth.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-warm" /></div>
          <div><label className="text-sm font-medium text-gray-600">{t("auth.password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-warm" /></div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-accent transition disabled:opacity-50">{loading ? t("auth.signingIn") : t("auth.signIn")}</button>
        </form>
        <div className="flex items-center gap-4 my-6"><hr className="flex-1" /><span className="text-sm text-gray-400">{t("auth.or")}</span><hr className="flex-1" /></div>
        <button className="w-full border border-gray-200 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition"><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> {t("auth.google")}</button>
        <button className="w-full border border-gray-200 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition mt-3"><span className="material-symbols-outlined text-blue-600">facebook</span> {t("auth.facebook")}</button>
        <p className="text-center text-sm text-gray-500 mt-6">{t("auth.noAccount")} <Link to="/register" className="text-primary font-semibold hover:underline">{t("auth.registerLink")}</Link></p>
      </div>
    </div>
  );
}
