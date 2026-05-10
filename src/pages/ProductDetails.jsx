import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    productName: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchProduct();
  }, [user, id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error("Product not found.");
      const data = await res.json();
      setProduct(data);
      // Pre-fill edit form
      setEditForm({
        productName: data.productName,
        price: data.price,
        imageUrl: data.imageUrl || "",
        description: data.description || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaveError("");
    if (!editForm.productName || !editForm.price) {
      setSaveError("Product name and price are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          price: Number(editForm.price),
        }),
      });

      if (!res.ok) throw new Error("Failed to update product.");

      const updated = await res.json();
      setProduct(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form back to current product values
    setEditForm({
      productName: product.productName,
      price: product.price,
      imageUrl: product.imageUrl || "",
      description: product.description || "",
    });
    setSaveError("");
    setIsEditing(false);
  };

  if (!user) return null;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#454040] flex items-center justify-center">
        <p className="text-[#D8D365] text-lg font-bold animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  // ── Error / Not Found ────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#454040] flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold text-red-400">
          {error || "Product Not Found"}
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#E6F082] text-[#454040] px-6 py-2 rounded-lg font-bold hover:bg-[#D8D365] hover:cursor-pointer transition-colors"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  // ── Detail View ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#454040] p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center text-[#D8D365] hover:text-[#E6F082] hover:cursor-pointer transition-colors font-bold"
        >
          ← BACK TO CATALOGUE
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#605B51] p-10 rounded-3xl shadow-2xl border border-[#D8D365]/10">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-inner bg-[#454040]">
            {(isEditing ? editForm.imageUrl : product.imageUrl) ? (
              <img
                src={isEditing ? editForm.imageUrl : product.imageUrl}
                alt={product.productName}
                className="w-full h-full object-cover min-h-64"
              />
            ) : (
              <div className="w-full min-h-64 flex items-center justify-center text-[#D8D365]/40 text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Info / Edit Form */}
          <div className="flex flex-col justify-center">
            <span className="text-[#D8D365] text-sm font-bold uppercase tracking-widest mb-2">
              Premium Collection
            </span>

            {isEditing ? (
              /* ── Edit Mode ── */
              <div className="flex flex-col gap-4">
                {saveError && (
                  <p className="text-sm text-red-400 bg-red-900/30 rounded-lg px-3 py-2">
                    {saveError}
                  </p>
                )}

                <input
                  name="productName"
                  value={editForm.productName}
                  onChange={handleEditChange}
                  placeholder="Product Name *"
                  className="w-full p-3 rounded-lg bg-[#454040] text-white text-xl font-bold border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082]"
                />

                <input
                  name="price"
                  type="number"
                  value={editForm.price}
                  onChange={handleEditChange}
                  placeholder="Price (Rs.) *"
                  className="w-full p-3 rounded-lg bg-[#454040] text-white text-lg font-bold border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082]"
                />

                <input
                  name="imageUrl"
                  value={editForm.imageUrl}
                  onChange={handleEditChange}
                  placeholder="Image URL"
                  className="w-full p-3 rounded-lg bg-[#454040] text-white text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082]"
                />

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                  rows={4}
                  className="w-full p-3 rounded-lg bg-[#454040] text-white text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082] resize-none"
                />

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 py-3 rounded-xl border border-[#D8D365]/40 text-[#D8D365] font-bold hover:bg-[#454040] hover:cursor-pointer transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-[#E6F082] text-[#454040] font-black hover:bg-[#D8D365] hover:cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <>
                <h1 className="text-5xl font-black text-[#E6F082] mb-4 tracking-tighter">
                  {product.productName}
                </h1>
                <p className="text-3xl font-bold text-white mb-6">
                  Rs. {Number(product.price).toLocaleString()}
                </p>
                <div className="w-16 h-1 bg-[#D8D365] mb-6"></div>
                <p className="text-gray-200 text-lg leading-relaxed mb-10">
                  {product.description || "No description available."}
                </p>

                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-4 bg-[#454040] text-[#E6F082] border border-[#E6F082]/30 font-black rounded-xl hover:bg-[#E6F082] hover:cursor-pointer hover:text-[#454040] transition-all transform active:scale-95 shadow-lg"
                  >
                    EDIT PRODUCT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
