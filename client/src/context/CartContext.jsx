import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchCart = async () => {
    if (!user) { setItems([]); setTotal(0); return; }
    try { setLoading(true); const res = await api.get("/cart"); setItems(res.data.items); setTotal(res.data.total); }
    catch (e) { console.error("Cart fetch failed"); } finally { setLoading(false); }
  };
  useEffect(() => { fetchCart(); }, [user]);
  const addToCart = async (productId, quantity = 1) => {
    try { await api.post("/cart", { productId, quantity }); await fetchCart(); toast.success("Added to cart!"); }
    catch (e) { toast.error(e.response?.data?.message || "Failed to add"); }
  };
  const updateQuantity = async (itemId, quantity) => {
    try { if (quantity < 1) { await removeFromCart(itemId); return; } await api.put("/cart/" + itemId, { quantity }); await fetchCart(); }
    catch (e) { toast.error("Failed to update"); }
  };
  const removeFromCart = async (itemId) => {
    try { await api.delete("/cart/" + itemId); await fetchCart(); toast.success("Removed"); }
    catch (e) { toast.error("Failed to remove"); }
  };
  const clearCart = async () => { try { await api.delete("/cart"); setItems([]); setTotal(0); } catch (e) {} };
  return (<CartContext.Provider value={{ items, total, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>{children}</CartContext.Provider>);
};
