import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  useEffect(() => { api.get("/products/" + slug).then(r => setProduct(r.data.product)).catch(() => toast.error("Product not found")).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="text-center py-20"><p>Product not found</p><Link to="/products" className="text-secondary underline">{t("productDetail.backToShop")}</Link></div>;
  const name = lang === "ar" && product.nameAr ? product.nameAr : product.name;
  const categoryName = product.category ? (lang === "ar" ? product.category.nameAr || product.category.name : product.category.name) : "";
  const description = lang === "ar" ? product.descriptionAr || product.description : product.description;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <div className="bg-warm rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            <img src={product.images?.[0] || "/placeholder.jpg"} alt={name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1">
          {categoryName && <p className="text-secondary font-cairo text-sm uppercase tracking-wider">{categoryName}</p>}
          <h1 className="font-cairo text-3xl font-bold mt-2">{name}</h1>
          {lang === "en" && product.nameAr && <p className="font-cairo text-xl text-gray-500 mt-1">{product.nameAr}</p>}
          <div className="flex items-center gap-1 mt-3">{[...Array(5)].map((_, i) => <span key={i} className={"material-symbols-outlined text-sm " + (i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300")}>star</span>)}<span className="text-sm text-gray-400 ml-2">({product.reviewCount} {t("productDetail.reviews")})</span></div>
          <div className="flex items-center gap-3 mt-4">
            <span className="font-cairo text-3xl font-bold text-primary">{t("currency")} {product.price}</span>
            {product.comparePrice && <span className="text-xl text-gray-400 line-through">{t("currency")} {product.comparePrice}</span>}
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">{description}</p>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-warm rounded-l-full rtl:rounded-r-full rtl:rounded-l-none"><span className="material-symbols-outlined">remove</span></button>
              <span className="px-4 py-2 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-warm rounded-r-full rtl:rounded-l-full rtl:rounded-r-none"><span className="material-symbols-outlined">add</span></button>
            </div>
          </div>
          {user ? (<button onClick={() => addToCart(product.id, qty)} className="mt-6 w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-accent transition flex items-center justify-center gap-2"><span className="material-symbols-outlined">add_shopping_cart</span> {t("productDetail.addToCart")}</button>)
          : (<Link to="/login" className="mt-6 block w-full bg-primary text-white py-3 rounded-full font-semibold text-center hover:bg-accent transition">{t("productDetail.loginToBuy")}</Link>)}
          <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-secondary">local_shipping</span> {t("productDetail.freeShipping")}</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-secondary">verified</span> {t("productDetail.qualityGuaranteed")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
