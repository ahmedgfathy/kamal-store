import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  if (!user) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart</span><p className="text-gray-500 mt-4">{t("cart.loginToView")}</p><Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full mt-4 inline-block">{t("cart.login")}</Link></div>;
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (items.length === 0) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><span className="material-symbols-outlined text-6xl text-gray-300">shopping_cart</span><p className="text-gray-500 mt-4">{t("cart.empty")}</p><Link to="/products" className="bg-primary text-white px-6 py-2 rounded-full mt-4 inline-block">{t("cart.startShopping")}</Link></div>;
  const shipping = total >= 500 ? 0 : 50;
  const tax = (total * 0.14).toFixed(2);
  const grandTotal = (total + shipping + parseFloat(tax)).toFixed(2);
  const itemName = (item) => (lang === "ar" && item.product?.nameAr ? item.product.nameAr : item.product?.name);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-cairo text-3xl font-bold mb-8">{t("cart.title")}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
              <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt={itemName(item)} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="font-cairo font-semibold">{itemName(item)}</h3>
                <p className="text-primary font-bold mt-1">{t("currency")} {item.product?.price}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-full">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-warm rounded-l-full rtl:rounded-r-full rtl:rounded-l-none"><span className="material-symbols-outlined text-sm">remove</span></button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-warm rounded-r-full rtl:rounded-l-full rtl:rounded-r-none"><span className="material-symbols-outlined text-sm">add</span></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-cairo font-bold text-lg mb-4">{t("cart.orderSummary")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{t("currency")} {total}</span></div>
              <div className="flex justify-between"><span>{t("cart.shipping")}</span><span>{shipping === 0 ? t("cart.free") : t("currency") + " " + shipping}</span></div>
              <div className="flex justify-between"><span>{t("cart.tax")}</span><span>{t("currency")} {tax}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>{t("cart.total")}</span><span className="text-primary">{t("currency")} {grandTotal}</span></div>
            </div>
            <Link to="/checkout" className="block w-full bg-primary text-white text-center py-3 rounded-full font-semibold mt-6 hover:bg-accent transition">{t("cart.checkout")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
