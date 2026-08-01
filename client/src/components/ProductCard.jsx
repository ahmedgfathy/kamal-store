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
    <div className="bg-porcelain rounded-xl sm:rounded-2xl overflow-hidden border border-line hover:border-secondary card-shadow-soft hover:shadow-lg transition group">
      <Link to={"/products/" + product.slug}>
        <div className="relative aspect-square bg-warm overflow-hidden">
          <img src={product.images?.[0] || "/placeholder.jpg"} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          {product.comparePrice && <span className="absolute top-2 left-2 bg-sale text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">{lang === "ar" ? "تخفيض" : "Sale"}</span>}
          {product.isFeatured && <span className="absolute top-2 right-2 bg-primary text-gold text-[10px] px-2 py-0.5 rounded-full font-semibold">{lang === "ar" ? "مميز" : "Featured"}</span>}
        </div>
      </Link>
      <div className="p-2.5 sm:p-4">
        {categoryName && <p className="text-[10px] sm:text-xs text-secondary font-cairo uppercase tracking-wider">{categoryName}</p>}
        <Link to={"/products/" + product.slug}><h3 className="font-cairo font-semibold text-xs sm:text-sm mt-1 line-clamp-2 hover:text-secondary transition leading-snug">{name}</h3></Link>
        <div className="flex items-center gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => <span key={i} className={"material-symbols-outlined text-[10px] sm:text-xs " + (i < Math.round(product.rating) ? "text-secondary" : "text-taupe")}>star</span>)}
          <span className="text-[10px] text-stone ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-cairo font-bold text-sm sm:text-lg text-primary">{t("currency")} {product.price}</span>
            {product.comparePrice && <span className="text-[10px] sm:text-xs text-stone line-through">{t("currency")} {product.comparePrice}</span>}
          </div>
          {user && <button onClick={(e) => { e.preventDefault(); addToCart(product.id); }} className="bg-primary text-cream p-1.5 sm:p-2 rounded-full hover:bg-accent transition"><span className="material-symbols-outlined text-sm sm:text-lg">add_shopping_cart</span></button>}
        </div>
      </div>
    </div>
  );
}
