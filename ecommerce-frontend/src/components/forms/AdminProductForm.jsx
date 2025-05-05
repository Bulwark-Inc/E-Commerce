import { useState } from "react";
import { useAdminProduct } from "../../context/AdminProductContext";
import { useProduct } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminProductForm = ({ initialData = null, onSuccess }) => {
  const { createProduct, updateProduct } = useAdminProduct();
  const { categories } = useProduct();
  const navigate = useNavigate();

  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category?.id || "",
    price: initialData?.price || "",
    discount_price: initialData?.discount_price || "",
    stock: initialData?.stock || "",
    available: initialData?.available || false,
    featured: initialData?.featured || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateProduct(initialData.slug, formData);
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        await createProduct(formData);
        toast.success("🎉 Product created successfully!");
        // Reset form after creation
        setFormData({
          name: "",
          description: "",
          category: "",
          price: "",
          discount_price: "",
          stock: "",
          available: false,
          featured: false,
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded shadow-md border">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          className="w-full border rounded p-2 focus:ring focus:border-blue-400"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          className="w-full border rounded p-2 focus:ring focus:border-blue-400"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          className="w-full border rounded p-2 focus:ring focus:border-blue-400"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            className="w-full border rounded p-2 focus:ring focus:border-blue-400"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discount Price</label>
          <input
            type="number"
            name="discount_price"
            className="w-full border rounded p-2 focus:ring focus:border-blue-400"
            value={formData.discount_price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          type="number"
          name="stock"
          className="w-full border rounded p-2 focus:ring focus:border-blue-400"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <span className="text-sm">Available</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span className="text-sm">Featured</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
      >
        {isEditMode ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default AdminProductForm;
