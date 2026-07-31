import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const name = lang === "ar" && product.nameAr ? product.nameAr : product.name;
  const categoryName = product.category ? (lang === "ar" ? product.category.nameAr || product.category.name : product.category.name) : "";
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
      <Link to={"/products/" + product.slug}>
        <div className="relative h-64 bg-warm overflow-hidden">
          <img src={product.images?.[0] || "/placeholder.jpg"} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          {product.comparePrice && <span className="absolute top-3 left-3 bg-sale text-white text-xs px-2 py-1 rounded-full">{lang === "ar" ? "تخفيض" : "Sale"}</span>}
          {product.isFeatured && <span className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">{lang === "ar" ? "مميز" : "Featured"}</span>}
        </div>
      </Link>
      <div className="p-4">
        {categoryName && <p className="text-xs text-secondary font-cairo uppercase tracking-wider">{categoryName}</p>}
        <Link to={"/products/" + product.slug}><h3 className="font-cairo font-semibold mt-1 hover:text-accent transition">{name}</h3></Link>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => <span key={i} className={"material-symbols-outlined text-sm " + (i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300")}>star</span>)}
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-cairo font-bold text-lg text-primary">{t("currency")} {product.price}</span>
            {product.comparePrice && <span className="text-sm text-gray-400 line-through">{t("currency")} {product.comparePrice}</span>}
          </div>
          {user && <button onClick={(e) => { e.preventDefault(); addToCart(product.id); }} className="bg-primary text-white p-2 rounded-full hover:bg-accent transition"><span className="material-symbols-outlined text-lg">add_shopping_cart</span></button>}
        </div>
      </div>
    </div>
  );
}
