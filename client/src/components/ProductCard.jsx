import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const name = lang === "ar" && product.nameAr ? product.nameAr : product.name;
  const category = product.category ? (lang === "ar" ? product.category.nameAr || product.category.name : product.category.name) : "Kamal Waheed";
  const discount = product.comparePrice ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100) : 0;
  return <article className="new-product-card">
    <Link to={`/products/${product.slug}`} className="new-product-card__image">
      <img src={product.images?.[0] || "/placeholder.svg"} alt={name} />
      {discount > 0 && <span className="new-product-card__sale">-{discount}%</span>}
      <span className="new-product-card__view"><span className="material-symbols-outlined">arrow_back</span></span>
    </Link>
    <div className="new-product-card__body">
      <p>{category}</p>
      <Link to={`/products/${product.slug}`}><h3>{name}</h3></Link>
      <div className="new-product-card__bottom"><div><strong>{product.price} {t("currency")}</strong>{product.comparePrice && <del>{product.comparePrice}</del>}</div>{user && <button onClick={() => addToCart(product.id)} aria-label={t("productDetail.addToCart")}><span className="material-symbols-outlined">add</span></button>}</div>
    </div>
  </article>;
}
