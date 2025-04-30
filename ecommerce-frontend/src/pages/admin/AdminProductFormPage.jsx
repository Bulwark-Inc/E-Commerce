// src/pages/admin/AdminProductFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminProduct } from '../../context/AdminProductContext';
import productService from '../../services/productService';

const AdminProductFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const { createProduct, updateProduct } = useAdminProduct();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    old_price: '',
    category: '',
    is_available: true,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    productService.getCategories().then((res) => setCategories(res.data));
    if (isEdit) {
      productService.getBySlug(slug).then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          old_price: res.data.old_price || '',
          category: res.data.category?.slug || '',
          is_available: res.data.is_available,
        });
      });
    }
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(slug, form);
        alert('Product updated');
      } else {
        const newProduct = await createProduct(form);
        alert('Product created');
        navigate(`/admin/products/edit/${newProduct.slug}`);
      }
    } catch (err) {
      setError('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit' : 'Create'} Product</h1>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <input
          type="number"
          name="old_price"
          placeholder="Old Price"
          value={form.old_price}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded"
        >
          <option value="">Select Category</option>
          
          {Array.isArray(categories) &&
          categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
          />
          <span>Available</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded text-white"
        >
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
