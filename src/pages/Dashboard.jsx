import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

// ── Modal for Adding a New Product ────────────────────────────────────────────
const AddProductModal = ({ onClose, onProductAdded }) => {
  const [form, setForm] = useState({
    productName: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.productName || !form.price) {
      setError("Product name and price are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });

      if (!res.ok) throw new Error("Failed to add product.");

      const newProduct = await res.json();
      onProductAdded(newProduct);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#605B51] rounded-2xl shadow-2xl w-full max-w-md border border-[#D8D365]/20 p-8">
        <h2 className="text-2xl font-black text-[#E6F082] mb-6 tracking-tight">
          ADD NEW PRODUCT
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-900/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="productName"
            placeholder="Product Name *"
            value={form.productName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#454040] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082]"
          />
          <input
            name="price"
            type="number"
            placeholder="Price (Rs.) *"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#454040] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082]"
          />
          <input
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#454040] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082]"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-lg bg-[#454040] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082] resize-none"
          />

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#D8D365]/40 text-[#D8D365] font-bold hover:bg-[#454040] hover:cursor-pointer transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#E6F082] text-[#454040] font-black hover:bg-[#D8D365] hover:cursor-pointer transition-colors disabled:opacity-50"
            >
              {loading ? "ADDING..." : "ADD PRODUCT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch products.");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Could not load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setDeletingId(productId);
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed.");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert("Could not delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#454040] p-8 text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-[#D8D365]/20 pb-6">
        <h1 className="text-4xl font-black text-[#E6F082] tracking-tighter">
          CATALOGUE
        </h1>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="text-sm font-medium text-[#D8D365]">
            User: <span className="text-white">{user.email}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#E6F082] text-[#454040] text-xs font-black rounded hover:bg-[#D8D365] hover:cursor-pointer transition-colors"
          >
            + ADD PRODUCT
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-[#605B51] text-[#D8D365] border border-[#D8D365]/30 text-xs font-bold rounded hover:bg-[#D8D365] hover:text-[#454040] hover:cursor-pointer transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="max-w-6xl mx-auto flex items-center justify-center py-24">
          <p className="text-[#D8D365] text-lg font-bold animate-pulse">
            Loading catalogue...
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="max-w-6xl mx-auto text-center py-24">
          <p className="text-red-400 text-lg font-bold mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-[#E6F082] text-[#454040] font-black rounded-lg hover:bg-[#D8D365] hover:cursor-pointer transition-colors"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-24">
          <p className="text-[#D8D365] text-lg font-bold mb-2">
            No products yet.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Click "ADD PRODUCT" to get started.
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-[#605B51] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-[#E6F082]/30"
            >
              {/* Image */}
              <div className="h-56 overflow-hidden bg-[#3a3635]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D8D365]/40 text-4xl">
                    📦
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#E6F082] mb-1 truncate">
                  {product.productName}
                </h3>
                <p className="text-[#D8D365] font-medium mb-4">
                  Rs. {Number(product.price).toLocaleString()}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="flex-1 py-2 bg-[#454040] text-[#E6F082] border border-[#E6F082]/20 rounded-lg text-xs font-bold hover:bg-[#E6F082] hover:cursor-pointer hover:text-[#454040] transition-colors"
                  >
                    VIEW
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="px-3 py-2 bg-red-900/40 text-red-400 border border-red-800/40 rounded-lg text-xs font-bold hover:bg-red-700 hover:cursor-pointer hover:text-white transition-colors disabled:opacity-50"
                  >
                    {deletingId === product.id ? "..." : "DEL"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;
