import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
export default function Products() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  useEffect(() => { api.get("/products/categories").then(r => setCategories(r.data.categories)); }, []);
  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    api.get("/products", { params }).then(r => { setProducts(r.data.products); setPagination(r.data.pagination); }).finally(() => setLoading(false));
  }, [page, category, search, sort]);
  const setFilter = (key, value) => { const params = new URLSearchParams(searchParams); if (value) { params.set(key, value); params.set("page", "1"); } else { params.delete(key); } setSearchParams(params); };
  const catName = (c) => (lang === "ar" ? c.nameAr || c.name : c.name);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-cairo text-3xl font-bold mb-8">{t("products.title")}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 shrink-0">
          <h3 className="font-cairo font-bold text-lg mb-4">{t("products.categories")}</h3>
          <div className="space-y-2">
            <button onClick={() => setFilter("category", "")} className={"block w-full text-left px-3 py-2 rounded-lg text-sm " + (!category ? "bg-primary text-white" : "hover:bg-warm")}>{t("products.allProducts")}</button>
            {categories.map(cat => (<button key={cat.id} onClick={() => setFilter("category", cat.id)} className={"block w-full text-left px-3 py-2 rounded-lg text-sm " + (category === cat.id ? "bg-primary text-white" : "hover:bg-warm")}>{catName(cat)}</button>))}
          </div>
          <h3 className="font-cairo font-bold text-lg mt-6 mb-3">{t("products.sortBy")}</h3>
          <div className="space-y-2">
            {[["", t("products.newest")], ["price_asc", t("products.priceLowHigh")], ["price_desc", t("products.priceHighLow")], ["name", t("products.nameAz")]].map(([val, label]) => (<button key={val} onClick={() => setFilter("sort", val)} className={"block w-full text-left px-3 py-2 rounded-lg text-sm " + (sort === val ? "bg-primary text-white" : "hover:bg-warm")}>{label}</button>))}
          </div>
        </aside>
        <div className="flex-1">
          {search && <p className="text-gray-500 mb-4">{t("products.resultsFor")} "<strong>{search}</strong>"</p>}
          {loading ? (<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>)
          : products.length === 0 ? (<div className="text-center py-20"><span className="material-symbols-outlined text-6xl text-gray-300">search_off</span><p className="text-gray-500 mt-4">{t("products.noProducts")}</p></div>)
          : (<>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
            {pagination.pages > 1 && (<div className="flex justify-center gap-2 mt-8">{Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setFilter("page", String(p))} className={"w-10 h-10 rounded-full text-sm " + (p === pagination.page ? "bg-primary text-white" : "bg-white hover:bg-warm")}>{p}</button>))}</div>)}
          </>)}
        </div>
      </div>
    </div>
  );
}
