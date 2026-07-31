import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (!user) { navigate("/login"); return; } api.get("/auth/addresses").then(r => { setAddresses(r.data.addresses); if (r.data.addresses.length > 0) setSelectedAddress(r.data.addresses[0].id); }); }, [user]);
  const shipping = total >= 500 ? 0 : 50;
  const tax = (total * 0.14).toFixed(2);
  const grandTotal = (total + shipping + parseFloat(tax)).toFixed(2);
  const handleOrder = async () => {
    if (!selectedAddress) { toast.error(t("checkout.selectAddress")); return; }
    setLoading(true);
    try {
      await api.post("/orders", { addressId: selectedAddress, paymentMethod, notes });
      await clearCart();
      toast.success(t("checkout.orderPlaced"));
      navigate("/my-orders");
    } catch (err) { toast.error(err.response?.data?.message || t("checkout.failed")); }
    finally { setLoading(false); }
  };
  const itemName = (item) => (lang === "ar" && item.product?.nameAr ? item.product.nameAr : item.product?.name);
  if (items.length === 0) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">{t("checkout.empty")}</p></div>;
  const paymentLabels = { cod: t("checkout.cod"), card: t("checkout.card"), wallet: t("checkout.wallet") };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-cairo text-3xl font-bold mb-8">{t("checkout.title")}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-cairo font-bold text-lg mb-4">{t("checkout.shippingAddress")}</h3>
            {addresses.length === 0 ? <p className="text-gray-500 text-sm">{t("checkout.noAddresses")}</p>
            : addresses.map(addr => (
              <label key={addr.id} className={"block border-2 rounded-xl p-4 mb-3 cursor-pointer transition " + (selectedAddress === addr.id ? "border-primary bg-warm" : "border-gray-100 hover:border-gray-200")}>
                <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="hidden" />
                <p className="font-semibold">{addr.fullName} - {addr.label}</p>
                <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.country}</p>
                <p className="text-sm text-gray-500">{addr.phone}</p>
              </label>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-cairo font-bold text-lg mb-4">{t("checkout.paymentMethod")}</h3>
            <div className="space-y-3">
              {[["cod", paymentLabels.cod], ["card", paymentLabels.card], ["wallet", paymentLabels.wallet]].map(([val, label]) => (
                <label key={val} className={"flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition " + (paymentMethod === val ? "border-primary bg-warm" : "border-gray-100")}>
                  <input type="radio" name="payment" value={val} checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-cairo font-bold text-lg mb-3">{t("checkout.orderNotes")}</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("checkout.notesPlaceholder")} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-primary" rows={3} />
          </div>
        </div>
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-cairo font-bold text-lg mb-4">{t("checkout.orderSummary")}</h3>
            <div className="space-y-2 text-sm max-h-48 overflow-auto mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between"><span className="truncate mr-2">{itemName(item)} x{item.quantity}</span><span>{t("currency")} {(item.product?.price * item.quantity).toFixed(2)}</span></div>
              ))}
            </div>
            <hr />
            <div className="space-y-2 text-sm mt-3">
              <div className="flex justify-between"><span>{t("checkout.subtotal")}</span><span>{t("currency")} {total}</span></div>
              <div className="flex justify-between"><span>{t("checkout.shipping")}</span><span>{shipping === 0 ? t("checkout.free") : t("currency") + " " + shipping}</span></div>
              <div className="flex justify-between"><span>{t("checkout.tax")}</span><span>{t("currency")} {tax}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>{t("checkout.total")}</span><span className="text-primary">{t("currency")} {grandTotal}</span></div>
            </div>
            <button onClick={handleOrder} disabled={loading} className="w-full bg-primary text-white py-3 rounded-full font-semibold mt-6 hover:bg-accent transition disabled:opacity-50">{loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
